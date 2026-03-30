export default function BeachCard({ beach }: { beach: any }) {
  return (
    /* Glassmorphism Tailwind UI:
      bg-white/10 = 10% opaque white
      backdrop-blur-md = blurs everything behind the card
      animate-in delay-200 = waits 0.2s, then slides up 
    */
    <div className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl animate-in delay-200 text-white">
      
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-3xl font-bold tracking-tight">
          {beach.name || "Secret Spot"}
        </h2>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30">
          Closest Beach
        </span>
      </div>

      <div className="space-y-3 mt-6">
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <span className="text-gray-400">Distance</span>
          <span className="text-xl font-semibold">
            {beach.driving_distance_meters 
                ? (Number(beach.driving_distance_meters) / 1000)
                .toFixed(1) : "0"} km
          </span>
        </div>
        
        {/* You can add more stats here later once your Python backend sends them! */}
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <span className="text-gray-400">Status</span>
          <span className="text-green-400 font-medium">Ready to surf</span>
        </div>
      </div>

    </div>
  );
}