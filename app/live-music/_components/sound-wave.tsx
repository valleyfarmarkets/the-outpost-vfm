"use client";

const colors = {
  brightGold: "#F9AC30",
};

export function SoundWave({ color = colors.brightGold }: { color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "24px" }}>
      {[0.6, 1, 0.4, 0.8, 0.5, 0.9, 0.3].map((height, i) => (
        <div
          key={i}
          style={{
            width: "4px",
            height: `${height * 100}%`,
            background: color,
            borderRadius: "2px",
            animation: `pulse 1s ease-in-out ${i * 0.1}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0% { transform: scaleY(0.5); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
