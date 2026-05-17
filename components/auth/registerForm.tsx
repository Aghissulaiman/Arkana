"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createClientSupabaseClient } from "@/lib/supabaseClient";

interface RegisterFormProps extends React.ComponentProps<"form"> {
  onLoginClick?: () => void;
}

export function RegisterForm({
  className,
  onLoginClick,
  ...props
}: RegisterFormProps) {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!fullName.trim()) {
      setError("Nama lengkap wajib diisi");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("users").insert({
        id: data.user.id,
        email: email,
        role: "user",
        provider: "credentials"
      });

      await supabase.from("profiles").insert({
        user_id: data.user.id,
        full_name: fullName,
        balance_points: 0
      });
    }

    setLoading(false);
    router.push("/complete-profile");
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?from=register`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-4", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup className="bg-card rounded-2xl shadow-lg border border-border p-6">
        <div className="text-center mb-4">
          <h1 className="text-xl font-semibold">Buat Akun</h1>
          <p className="text-xs text-muted-foreground mt-1">Daftar cepat dengan email atau Google</p>
        </div>

        <Field>
          <FieldLabel className="text-sm">Nama Lengkap</FieldLabel>
          <Input
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-background"
          />
        </Field>

        <Field>
          <FieldLabel className="text-sm">Email</FieldLabel>
          <Input
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background"
          />
        </Field>

        <Field>
          <FieldLabel className="text-sm">Password</FieldLabel>
          <Input
            type="password"
            placeholder="Minimal 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-background"
          />
        </Field>

        {error && (
          <p className="text-xs text-red-500 text-center">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Memproses..." : "Daftar"}
        </Button>

        <FieldSeparator>Atau</FieldSeparator>

        <Button variant="outline" type="button" onClick={handleGoogleRegister} disabled={loading} className="w-full">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </Button>

        <FieldDescription className="text-center text-xs">
          Sudah punya akun?{" "}
          <button type="button" onClick={onLoginClick} className="text-primary font-semibold">
            Masuk
          </button>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}