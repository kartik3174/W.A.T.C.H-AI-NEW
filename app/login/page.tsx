import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"
import { WatchLogo } from "@/components/watch-logo"
import { LeafDecoration } from "@/components/leaf-decoration"

export const metadata: Metadata = {
  title: "Login | Wildlife Watch",
  description: "Login to access the Wildlife AI Tracking and Conservation Hub",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0B132B] to-[#1C3A52] relative overflow-hidden p-4">
      {/* Decorative leaf elements using the new component */}
      <LeafDecoration position="top-left" size="lg" rotation={45} opacity={0.2} />
      <LeafDecoration position="bottom-right" size="xl" rotation={-12} opacity={0.2} />
      <LeafDecoration position="top-right" size="sm" rotation={90} opacity={0.1} />
      <LeafDecoration position="bottom-left" size="sm" rotation={-45} opacity={0.1} />

      <div className="w-full max-w-md p-6 sm:p-8 space-y-8 bg-[#1C7ED6] rounded-lg shadow-2xl border-3 border-[#FF7A00] relative z-10">
        <div className="flex flex-col items-center justify-center space-y-2">
          <WatchLogo showText size={48} />
          <h1 className="text-3xl font-bold text-center text-[#FF7A00]">Login to W.A.T.C.H</h1>
          <p className="text-sm text-[#EAEAEA] text-center font-semibold">Wildlife AI Tracking and Conservation Hub</p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
