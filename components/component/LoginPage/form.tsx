"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface LoginFormProps extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  onRegisterClick?: () => void;
}

export function LoginForm({
  className,
  onRegisterClick,
  ...props
}: LoginFormProps) {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Perform login logic here if needed
    router.push("/home")
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-emerald-100/50">
        <div className="flex flex-col items-center gap-2 text-center mb-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Selamat Datang
          </h1>
          <p className="text-sm text-balance text-slate-500">
            Masuk ke akun Anda untuk mulai menukar sampah jadi poin.
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="login-email" className="text-slate-700 font-medium">Email</FieldLabel>
          <Input id="login-email" type="email" placeholder="nama@email.com" required className="focus-visible:ring-emerald-500 border-slate-200" />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="login-password" className="text-slate-700 font-medium">Password</FieldLabel>
            <a href="#" className="ml-auto text-xs font-medium text-emerald-600 underline-offset-4 hover:underline hover:text-emerald-700">
              Lupa password?
            </a>
          </div>
          <Input id="login-password" type="password" required className="focus-visible:ring-emerald-500 border-slate-200" />
        </Field>

        <Field className="pt-2">
          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98]">
            Masuk
          </Button>
        </Field>

        <FieldSeparator className="text-slate-400">Atau</FieldSeparator>

        <Field>
          <Button variant="outline" type="button" onClick={() => router.push('/home')} className="w-full border-slate-200 hover:bg-slate-50 hover:text-emerald-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Masuk dengan Google
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center mt-2">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={onRegisterClick}
              className="font-semibold text-emerald-600 underline underline-offset-4 hover:text-emerald-700"
            >
              Daftar sekarang
            </button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}