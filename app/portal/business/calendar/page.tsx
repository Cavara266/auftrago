import BusinessWeekPlanner from "@/components/business/BusinessWeekPlanner";
import BusinessJobPlanner from "@/components/business/BusinessJobPlanner";

export default async function BusinessCalendarPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#061120",
        color: "#f8fafc",
      }}
    >
      <div
        style={{
          width: "min(100%,1500px)",
          margin: "0 auto",
          padding: "34px 28px 80px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            color: "#7dd3fc",
            fontSize: 10,
            fontWeight: 950,
            letterSpacing: ".10em",
          }}
        >
          AUFTRAGO PLANNING
        </div>

        <h1
          style={{
            margin: "8px 0 7px",
            fontSize: "clamp(38px,5vw,64px)",
            lineHeight: 1,
            letterSpacing: "-.05em",
          }}
        >
          Kalender & Planung
        </h1>

        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: 13,
          }}
        >
          Aufgaben, Termine und Einsätze zentral planen.
        </p>

        <div style={{ height: 26 }} />

        <BusinessWeekPlanner />

        <div style={{ height: 26 }} />

        <BusinessJobPlanner />
      </div>
    </main>
  );
}
