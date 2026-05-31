export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
      <p className="mt-4 text-sm tracking-widest text-amber-700 font-semibold">PRIDEPROMART</p>
    </div>
  )
}