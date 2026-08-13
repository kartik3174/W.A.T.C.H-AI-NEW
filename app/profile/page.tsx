import type { Metadata } from "next"
import { PageHeader } from "@/components/dashboard/page-header"
import { UserProfile } from "@/components/user/user-profile"
import { LeafDecoration } from "@/components/leaf-decoration"

export const metadata: Metadata = {
  title: "User Profile | W.A.T.C.H",
  description: "Manage your user profile and preferences",
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-6 relative">
      <LeafDecoration position="top-right" size="lg" opacity={0.05} className="hidden lg:block" />
      <LeafDecoration position="bottom-left" size="md" rotation={45} opacity={0.05} className="hidden lg:block" />

      <PageHeader title="User Profile" description="Manage your account information and preferences" />
      <UserProfile />
    </div>
  )
}
