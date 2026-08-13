export default function Loading() {
  return (
    <div className="container mx-auto py-6 animate-pulse">
      <div className="h-8 w-1/3 bg-muted rounded mb-6"></div>
      <div className="h-4 w-2/3 bg-muted rounded mb-12"></div>
      <div className="space-y-6">
        <div className="h-[400px] bg-muted rounded"></div>
        <div className="h-[200px] bg-muted rounded"></div>
      </div>
    </div>
  )
}
