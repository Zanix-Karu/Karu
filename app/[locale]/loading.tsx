export default function LandingLoading() {
  return (
    <div className="min-h-screen bg-brown-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
        <p className="text-cream/40 text-sm font-light tracking-wide">Loading</p>
      </div>
    </div>
  )
}
