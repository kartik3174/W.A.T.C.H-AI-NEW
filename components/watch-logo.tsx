import Image from "next/image"

interface WatchLogoProps {
  className?: string
  size?: number | "small" | "medium" | "large"
  showText?: boolean
}

export function WatchLogo({ className = "", size = 40, showText = false }: WatchLogoProps) {
  // Convert string sizes to numbers
  let sizeValue = size
  if (size === "small") sizeValue = 32
  if (size === "medium") sizeValue = 40
  if (size === "large") sizeValue = 56

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative" style={{ width: sizeValue, height: sizeValue }}>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/14-147415_tiger-paw-picture-clemson-tigers-football-logo-removebg-preview-6HuPTWVk1DefPwtvRmBXeuZwEuPDto.png"
          alt="WATCH Logo"
          width={sizeValue as number}
          height={sizeValue as number}
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="ml-2 flex flex-col">
          <span className="font-bold text-lg leading-tight">W.A.T.C.H</span>
          <span className="text-xs text-primary leading-tight hidden sm:block">
            Wildlife AI Tracking and Conservation Hub
          </span>
          <span className="text-xs text-primary leading-tight sm:hidden">Wildlife AI Hub</span>
        </div>
      )}
    </div>
  )
}
