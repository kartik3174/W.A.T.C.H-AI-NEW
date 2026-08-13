"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Mail, MapPin, Phone, User } from "lucide-react"

const zookeepers = [
  {
    id: "zk-001",
    name: "Sarah Johnson",
    role: "Senior Zookeeper",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zookeeper-female.jpg-Yx9Yd9Ij9Yd9Ij9Yd9Ij9Yd9Ij9Yd9Ij",
    specialization: "Large Mammals",
    experience: "12 years",
    education: "B.Sc. in Zoology, M.Sc. in Wildlife Conservation",
    email: "sarah.johnson@watch.org",
    phone: "+1 (555) 123-4567",
    location: "North Region",
    bio: "Sarah has dedicated her career to the care and conservation of large mammals. With over a decade of experience, she specializes in elephant and rhino care, focusing on behavioral enrichment and health monitoring. She has been instrumental in developing our advanced tracking protocols.",
    achievements: [
      "Developed innovative feeding enrichment program for elephants",
      "Led successful rhino breeding program",
      "Published research on elephant social behaviors",
      "Trained 15+ junior zookeepers",
    ],
    animals: ["Tembo (EL-001)", "Kifaru (RH-003)"],
  },
  {
    id: "zk-002",
    name: "Michael Chen",
    role: "Wildlife Veterinarian",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zookeeper-male.jpg-Yx9Yd9Ij9Yd9Ij9Yd9Ij9Yd9Ij9Yd9Ij",
    specialization: "Veterinary Medicine",
    experience: "8 years",
    education: "Doctor of Veterinary Medicine, Certification in Wildlife Medicine",
    email: "michael.chen@watch.org",
    phone: "+1 (555) 987-6543",
    location: "All Regions",
    bio: "Michael joined our team after working with various wildlife conservation projects across Asia. His expertise in wildlife medicine has been crucial for maintaining the health of our animals. He specializes in preventative care and emergency medical interventions for big cats and primates.",
    achievements: [
      "Pioneered non-invasive health monitoring techniques",
      "Successfully treated Raja's respiratory infection",
      "Developed vaccination protocol for all species",
      "Leads the emergency response medical team",
    ],
    animals: ["Raja (TI-004)", "Zuri (GO-005)", "Simba (LI-002)"],
  },
]

const forestOfficers = [
  {
    id: "fo-001",
    name: "David Okafor",
    role: "Chief Conservation Officer",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/forest-officer-male.jpg-Yx9Yd9Ij9Yd9Ij9Yd9Ij9Yd9Ij9Yd9Ij",
    specialization: "Anti-Poaching Operations",
    experience: "15 years",
    education: "B.Sc. in Environmental Science, M.Sc. in Conservation Management",
    email: "david.okafor@watch.org",
    phone: "+1 (555) 456-7890",
    location: "All Regions",
    bio: "David leads our conservation security team with 15 years of experience in anti-poaching operations. His strategic approach to conservation security has resulted in a 75% reduction in poaching incidents within our protected areas. He coordinates with local communities and government agencies to ensure comprehensive protection.",
    achievements: [
      "Implemented AI-powered security monitoring system",
      "Reduced poaching incidents by 75% over 5 years",
      "Established community conservation ambassador program",
      "Trained 30+ rangers in advanced tracking techniques",
    ],
    regions: ["North Region", "South Region", "East Region", "West Region"],
  },
  {
    id: "fo-002",
    name: "Elena Rodriguez",
    role: "Environmental Education Officer",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/forest-officer-female.jpg-Yx9Yd9Ij9Yd9Ij9Yd9Ij9Yd9Ij9Yd9Ij",
    specialization: "Community Engagement",
    experience: "7 years",
    education: "B.A. in Environmental Education, M.Ed. in Conservation Outreach",
    email: "elena.rodriguez@watch.org",
    phone: "+1 (555) 789-0123",
    location: "South Region",
    bio: "Elena focuses on building bridges between conservation efforts and local communities. Her outreach programs have engaged thousands of community members and students in wildlife conservation. She develops educational materials and programs that highlight the importance of biodiversity and sustainable practices.",
    achievements: [
      "Created award-winning conservation curriculum for schools",
      "Established visitor education center with interactive exhibits",
      "Launched community-based conservation monitoring program",
      "Organized annual conservation awareness festival",
    ],
    regions: ["South Region", "East Region"],
  },
]

export function StaffProfiles() {
  const [selectedProfile, setSelectedProfile] = useState<any>(null)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="zookeepers" className="space-y-6">
        <TabsList className="w-full grid grid-cols-2 h-auto">
          <TabsTrigger value="zookeepers" className="py-2">
            Zookeepers & Veterinarians
          </TabsTrigger>
          <TabsTrigger value="forestOfficers" className="py-2">
            Conservation Officers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="zookeepers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {zookeepers.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ProfileCard profile={profile} onViewDetails={() => setSelectedProfile(profile)} />
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forestOfficers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {forestOfficers.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ProfileCard profile={profile} onViewDetails={() => setSelectedProfile(profile)} />
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedProfile && (
        <ProfileDetailsDialog
          profile={selectedProfile}
          open={!!selectedProfile}
          onOpenChange={() => setSelectedProfile(null)}
        />
      )}
    </div>
  )
}

function ProfileCard({ profile, onViewDetails }: { profile: any; onViewDetails: () => void }) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${profile.image})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-xl font-bold">{profile.name}</h3>
          <p className="text-sm opacity-90">{profile.role}</p>
        </div>
      </div>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10">
              {profile.specialization}
            </Badge>
            <Badge variant="outline" className="bg-secondary/10">
              {profile.experience} exp
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">{profile.bio}</p>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button onClick={onViewDetails} className="w-full transition-all duration-300 hover:scale-105">
          View Full Profile
        </Button>
      </CardFooter>
    </Card>
  )
}

function ProfileDetailsDialog({
  profile,
  open,
  onOpenChange,
}: { profile: any; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{profile.name}</DialogTitle>
          <DialogDescription>{profile.role}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden mb-4">
              <Avatar className="w-full h-auto aspect-square">
                <AvatarImage src={profile.image} alt={profile.name} />
                <AvatarFallback>
                  {profile.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.specialization}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.experience} experience</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.phone}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Biography</h3>
              <p className="text-muted-foreground">{profile.bio}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Education</h3>
              <p className="text-muted-foreground">{profile.education}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Key Achievements</h3>
              <ul className="space-y-1">
                {profile.achievements.map((achievement: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {profile.animals && (
              <div>
                <h3 className="text-lg font-medium mb-2">Animals Under Care</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.animals.map((animal: string) => (
                    <Badge key={animal} variant="outline" className="bg-primary/10">
                      {animal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {profile.regions && (
              <div>
                <h3 className="text-lg font-medium mb-2">Regions Overseen</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.regions.map((region: string) => (
                    <Badge key={region} variant="outline" className="bg-secondary/10">
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
