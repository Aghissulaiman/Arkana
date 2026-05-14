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

interface LoginFormProps extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  onRegisterClick?: () => void;
}

export function LoginForm({
  className,
  onRegisterClick,
  ...props
}: LoginFormProps) {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await handleUserRedirect(data.user);
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: 'select_account', // ← MEMAKSA PILIH AKUN
        },
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleUserRedirect = async (user: any) => {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = userData?.role || "user";

    switch (role) {
      case "admin":
        router.push("/admin");
        break;
      case "agent":
        router.push("/agent");
        break;
      default:
        router.push("/user/home");
        break;
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup className="bg-card rounded-2xl shadow-lg border border-border p-8">
        <div className="flex flex-col items-center gap-2 text-center mb-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Selamat Datang
          </h1>
          <p className="text-sm text-muted-foreground">
            Masuk dengan email dan password
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email" className="text-foreground">
            Email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-background border-border"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password" className="text-foreground">
            Password
          </FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="Password Anda"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-background border-border"
          />
        </Field>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? "Memproses..." : "Masuk"}
        </Button>

        <FieldSeparator className="text-muted-foreground">Atau</FieldSeparator>

        <Button
          variant="outline"
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full border-border hover:bg-muted"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Masuk dengan Google
        </Button>

        <FieldDescription className="text-center mt-4 text-muted-foreground">
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={onRegisterClick}
            className="font-semibold text-primary hover:underline"
          >
            Daftar sekarang
          </button>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}