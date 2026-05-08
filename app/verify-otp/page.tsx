"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const OTP_LENGTH = 8;

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const canResend = timeLeft === 0;
  const hasAutoVerified = useRef(false); // 🔥 Cegah auto-verify ganda

  const handleVerify = useCallback(async () => {
    if (!email) {
      setError("Email tidak ditemukan.");
      return;
    }

    const otpCode = otp.join("");
    if (otpCode.length !== OTP_LENGTH) {
      setError(`Masukkan ${OTP_LENGTH} digit OTP`);
      return;
    }

    setIsVerifying(true);
    setError("");

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: "email",
    });

    if (verifyError) {
      setError(verifyError.message);
      setIsVerifying(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: existingDetails } = await supabase
        .from("user_details")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!existingDetails) {
        const pendingData = localStorage.getItem("pendingRegistration");
        const userName = pendingData 
          ? JSON.parse(pendingData).name 
          : user.user_metadata?.name || "User";

        await supabase.from("user_details").insert({
          user_id: user.id,
          name: userName,
          balance_points: 0
        });

        if (pendingData) {
          localStorage.removeItem("pendingRegistration");
        }
      }
    }

    setIsVerifying(false);
    setIsSuccess(true);

    setTimeout(() => {
      router.push("/user/home");
    }, 2000);
  }, [email, otp, router]);

  // 🔥 Auto-verify ketika semua digit terisi
  useEffect(() => {
    const isComplete = otp.every((digit) => digit !== "");
    if (isComplete && !isVerifying && !isSuccess && !hasAutoVerified.current) {
      hasAutoVerified.current = true;
      handleVerify();
    }
  }, [otp, isVerifying, isSuccess, handleVerify]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Reset auto-verify flag ketika OTP berubah
  useEffect(() => {
    if (!otp.every((digit) => digit !== "")) {
      hasAutoVerified.current = false;
    }
  }, [otp]);

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digits = pastedText.replace(/\D/g, "").slice(0, OTP_LENGTH);
    
    const newOtp = [...otp];
    for (let i = 0; i < digits.length; i++) {
      newOtp[i] = digits[i];
    }
    setOtp(newOtp);
    
    if (digits.length > 0) {
      const focusIndex = Math.min(digits.length, OTP_LENGTH - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus ke input berikutnya
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    setTimeLeft(60);
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    hasAutoVerified.current = false;
    
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (resendError) {
      setError(resendError.message);
    }
    
    inputRefs.current[0]?.focus();
  };

  if (isVerifying) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-background p-4">
        <FieldGroup className="bg-card rounded-2xl shadow-lg border border-border p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Memverifikasi...</h2>
          <p className="text-sm text-muted-foreground">Sedang memeriksa kode Anda</p>
        </FieldGroup>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-background p-4">
        <FieldGroup className="bg-card rounded-2xl shadow-lg border border-border p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Verifikasi Berhasil!</h2>
          <p className="text-sm text-muted-foreground">Akun Anda telah terverifikasi</p>
          <p className="text-xs text-primary mt-4">Mengalihkan ke beranda...</p>
        </FieldGroup>
      </div>
    );
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <FieldGroup className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Verifikasi Email</h1>
            <p className="text-sm text-muted-foreground">Kami telah mengirim kode verifikasi ke email Anda</p>
            <p className="text-xs text-primary mt-1 font-medium">{email || "email@example.com"}</p>
          </div>

          {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}

          <Field>
            <FieldLabel className="text-foreground text-center block">Kode Verifikasi ({OTP_LENGTH} digit)</FieldLabel>
            <div className="flex justify-center gap-2 mt-2 flex-wrap" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-12 text-center text-lg font-semibold bg-background border-border focus-visible:ring-primary"
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </Field>

          <div className="text-center mt-4">
            {canResend ? (
              <button onClick={handleResend} className="text-sm text-primary hover:underline">
                Kirim ulang kode
              </button>
            ) : (
              <p className="text-sm text-muted-foreground">Kirim ulang kode dalam {timeLeft} detik</p>
            )}
          </div>

          <FieldDescription className="text-center mt-4 text-muted-foreground text-xs">
            Tidak menerima email? Periksa folder spam atau
            <button onClick={handleResend} className="text-primary hover:underline ml-1">kirim ulang</button>
          </FieldDescription>
        </FieldGroup>
      </div>
    </div>
  );
}