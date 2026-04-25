export default function LuxBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 15% 10%, rgba(57,183,255,0.25), transparent 60%)," +
            "radial-gradient(1000px 650px at 85% 20%, rgba(216,179,90,0.12), transparent 55%)," +
            "radial-gradient(800px 700px at 40% 90%, rgba(57,183,255,0.16), transparent 60%)," +
            "linear-gradient(180deg, #070A12 0%, #060913 50%, #050816 100%)",
        }}
      />

      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
          maskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.9) 40%, transparent 75%)",
        }}
      />

      {/* wave lines */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.55]" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="rgba(57,183,255,0.0)" />
            <stop offset="0.4" stopColor="rgba(57,183,255,0.45)" />
            <stop offset="0.7" stopColor="rgba(57,183,255,0.15)" />
            <stop offset="1" stopColor="rgba(57,183,255,0.0)" />
          </linearGradient>
        </defs>
        {Array.from({ length: 9 }).map((_, i) => {
          const y = 120 + i * 70;
          const amp = 22 + i * 2.5;
          return (
            <path
              key={i}
              d={`M 0 ${y}
                 C 240 ${y - amp}, 420 ${y + amp}, 600 ${y}
                 S 960 ${y - amp}, 1200 ${y}`}
              fill="none"
              stroke="url(#g)"
              strokeWidth={2}
            />
          );
        })}
      </svg>

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 700px at 50% 45%, transparent 45%, rgba(0,0,0,0.55) 90%)",
        }}
      />
    </div>
  );
}