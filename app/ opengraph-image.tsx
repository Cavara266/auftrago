import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Auftrago – Schweizer Plattform für Dienstleistungen";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "78px",
          background:
            "radial-gradient(circle at 20% 20%, #0ea5e955, transparent 34%), linear-gradient(135deg, #030816 0%, #071426 55%, #04101c 100%)",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 30,
            fontWeight: 800,
            color: "#7dd3fc",
          }}
        >
          AUFTRAGO.CH
        </div>

        <div
          style={{
            marginTop: 28,
            maxWidth: 980,
            fontSize: 70,
            lineHeight: 1.05,
            fontWeight: 900,
            letterSpacing: "-3px",
          }}
        >
          Schweizer Anbieter finden und Offerten vergleichen
        </div>

        <div
          style={{
            marginTop: 30,
            fontSize: 29,
            color: "#cbd5e1",
          }}
        >
          Kostenlos · unverbindlich · regional
        </div>
      </div>
    ),
    size
  );
}
