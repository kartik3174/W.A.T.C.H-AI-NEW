interface OwlLogoProps {
  className?: string
  size?: number
}

export function OwlLogo({ className = "", size = 40 }: OwlLogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Owl face (circular background) */}
      <div
        className="absolute inset-0 rounded-full bg-[hsl(var(--owl-cream))] border-2 border-[hsl(var(--owl-brown))]"
        style={{ width: size, height: size }}
      ></div>

      {/* Eyes */}
      <div
        className="absolute owl-eyes rounded-full"
        style={{
          width: size * 0.25,
          height: size * 0.25,
          top: size * 0.25,
          left: size * 0.2,
        }}
      ></div>
      <div
        className="absolute owl-eyes rounded-full"
        style={{
          width: size * 0.25,
          height: size * 0.25,
          top: size * 0.25,
          right: size * 0.2,
        }}
      ></div>

      {/* Beak */}
      <div
        className="absolute bg-[hsl(var(--owl-brown))] rotate-45"
        style={{
          width: size * 0.2,
          height: size * 0.2,
          top: size * 0.45,
          left: size * 0.4,
        }}
      ></div>

      {/* Eyebrows */}
      <div
        className="absolute bg-[hsl(var(--owl-dark))] rounded-full"
        style={{
          width: size * 0.35,
          height: size * 0.08,
          top: size * 0.15,
          left: size * 0.15,
          transform: "rotate(-15deg)",
        }}
      ></div>
      <div
        className="absolute bg-[hsl(var(--owl-dark))] rounded-full"
        style={{
          width: size * 0.35,
          height: size * 0.08,
          top: size * 0.15,
          right: size * 0.15,
          transform: "rotate(15deg)",
        }}
      ></div>
    </div>
  )
}
