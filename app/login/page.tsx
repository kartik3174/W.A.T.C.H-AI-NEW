import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { WatchLogo } from "@/components/watch-logo";
import { LeafDecoration } from "@/components/leaf-decoration";

export const metadata: Metadata = {
  title: "Login | Wildlife Watch",
  description: "Login to access the Wildlife AI Tracking and Conservation Hub",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0B132B] to-[#1C3A52] relative overflow-hidden p-4">

      {/* Decorative Leaves */}
      <LeafDecoration position="top-left" size="lg" rotation={45} opacity={0.2} />
      <LeafDecoration position="bottom-right" size="xl" rotation={-12} opacity={0.2} />
      <LeafDecoration position="top-right" size="sm" rotation={90} opacity={0.1} />
      <LeafDecoration position="bottom-left" size="sm" rotation={-45} opacity={0.1} />

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#1C7ED6] p-6 sm:p-8 rounded-xl shadow-2xl border-2 border-[#FF7A00] relative z-10">

        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-6 space-y-2">
          <WatchLogo showText size={48} />

          <h1 className="text-3xl font-bold text-[#FF7A00] text-center">
            Login to W.A.T.C.H
          </h1>

          <p className="text-sm text-[#EAEAEA] text-center font-semibold">
            Wildlife AI Tracking and Conservation Hub
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />

      </div>
    </div>
  );
}