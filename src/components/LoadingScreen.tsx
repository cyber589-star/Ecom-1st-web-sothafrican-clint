'use client'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] bg-amber-950 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 border-2 border-primary/20 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
        <div className="absolute inset-0 w-20 h-20 border-2 border-transparent border-t-primary rounded-full animate-spin" style={{ animationDuration: '1s' }} />
        <div className="absolute inset-2 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-sm animate-pulse" />
      </div>
      <p className="mt-6 text-sm tracking-[0.3em] text-gradient font-semibold animate-pulse">PRIDEPROMART</p>
      <p className="text-[10px] tracking-[0.2em] text-gray-600 mt-2">LUXURY COLLECTION</p>
    </div>
  )
}
