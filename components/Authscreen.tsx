"use client";

import { useState, useEffect } from "react";
import { Leaf } from "lucide-react";
import { LoginForm } from "@/components/auth/loginForm";
import { RegisterForm } from "@/components/auth/registerForm";
import { cn } from "@/lib/utils";

export function AuthScreen({
  initialIsLogin = true,
}: {
  initialIsLogin?: boolean;
}) {
  const [isLogin, setIsLogin] = useState(initialIsLogin);

  const handleToggle = (toLogin: boolean) => {
    setIsLogin(toLogin);
    window.history.pushState(null, "", toLogin ? "/login" : "/register");
  };

  useEffect(() => {
    const handlePopState = () => {
      setIsLogin(window.location.pathname === "/login");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="relative min-h-svh w-full bg-slate-50 overflow-hidden">
      <div className="absolute inset-0 hidden lg:flex w-full h-full z-0">
        <div className="relative w-1/2 h-full overflow-hidden">
          <div
            className={cn(
              "absolute inset-0 bg-slate-50 transition-opacity duration-1000 ease-in-out",
              isLogin ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            className={cn(
              "absolute inset-0 bg-emerald-950 transition-opacity duration-1000 ease-in-out",
              !isLogin ? "opacity-100" : "opacity-0",
            )}
          >
            <img
              src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=2000&auto=format&fit=crop"
              alt="Community Recycling"
              className={cn(
                "w-full h-full object-cover transition-transform duration-1000",
                !isLogin ? "scale-100" : "scale-110",
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/40 to-transparent mix-blend-multiply" />

            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 p-16 text-white transition-all duration-700 delay-300",
                !isLogin
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8",
              )}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-10 bg-emerald-400 rounded-full"></div>
                <span className="text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                  Langkah Pertama
                </span>
              </div>
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Mulai Jadi <br />
                <span className="text-emerald-400">Pahlawan Bumi.</span>
              </h2>
              <p className="text-emerald-100/80 text-lg max-w-md">
                Daftarkan dirimu sekarang, mulai pilah sampahmu, dan raih
                keuntungan nyata dari setiap aksi peduli lingkungan.
              </p>
            </div>
          </div>
        </div>

        <div className="relative w-1/2 h-full overflow-hidden">
          <div
            className={cn(
              "absolute inset-0 bg-emerald-950 transition-opacity duration-1000 ease-in-out",
              isLogin ? "opacity-100" : "opacity-0",
            )}
          >
            <img
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2000&auto=format&fit=crop"
              alt="Recycle Bins Concept"
              className={cn(
                "w-full h-full object-cover transition-transform duration-1000",
                isLogin ? "scale-100" : "scale-110",
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/40 to-transparent mix-blend-multiply" />

            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 p-16 text-white transition-all duration-700 delay-300",
                isLogin
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8",
              )}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-10 bg-emerald-400 rounded-full"></div>
                <span className="text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                  Ubah Sampah Jadi Berkah
                </span>
              </div>
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Daur Ulang & <br />
                <span className="text-emerald-400">Dapatkan Poin.</span>
              </h2>
              <p className="text-emerald-100/80 text-lg max-w-md">
                Tukarkan sampahmu menjadi poin berharga yang bisa langsung
                digunakan untuk berbagai keperluan sehari-hari.
              </p>
            </div>
          </div>
          <div
            className={cn(
              "absolute inset-0 bg-slate-50 transition-opacity duration-1000 ease-in-out",
              !isLogin ? "opacity-100" : "opacity-0",
            )}
          />
        </div>
      </div>

      <div
        className={cn(
          "absolute top-0 h-full w-full lg:w-1/2 flex flex-col p-6 md:p-10 z-20 transition-transform duration-1000 ease-in-out",
          isLogin ? "left-0 translate-x-0" : "left-0 lg:translate-x-full",
        )}
      >
        <div className="flex justify-center gap-2 md:justify-start z-30">
          <a
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-emerald-900 transition-transform hover:scale-105"
          >
            <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
              <Leaf className="size-5" />
            </div>
            TrashFlow
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center relative w-full mt-4">
          <div
            className={cn(
              "absolute w-full max-w-sm transition-all duration-700 ease-in-out",
              isLogin
                ? "opacity-100 translate-x-0 pointer-events-auto delay-200"
                : "opacity-0 -translate-x-8 pointer-events-none",
            )}
          >
            <LoginForm onRegisterClick={() => handleToggle(false)} />
          </div>

          <div
            className={cn(
              "absolute w-full max-w-sm transition-all duration-700 ease-in-out",
              !isLogin
                ? "opacity-100 translate-x-0 pointer-events-auto delay-200"
                : "opacity-0 translate-x-8 pointer-events-none",
            )}
          >
            <RegisterForm onLoginClick={() => handleToggle(true)} />
          </div>
        </div>
      </div>
    </div>
  );
}
