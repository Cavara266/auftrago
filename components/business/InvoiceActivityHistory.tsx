type Activity = {
  id: string;
  type: string;
  message: string;
  createdAt: Date | string;
};

export default function InvoiceActivityHistory({
  activities = [],
}: {
  activities?: Activity[];
}) {
  if (!activities.length) {
    return null;
  }

  const icon: Record<string, string> = {
    CREATED: "＋",
    SENT: "✉",
    PAYMENT: "💰",
    PAYMENT_REMOVED: "↩",
    REMINDER_1: "🔔",
    REMINDER_2: "⚠",
    CANCELLED: "✕",
    DUPLICATED: "⧉",
    EDITED: "✎",
  };

  return (
    <section
      style={{
        marginTop: 18,
        padding: 24,
        borderRadius: 20,
        border: "1px solid rgba(148,163,184,.14)",
        background: "rgba(10,22,41,.92)",
      }}
    >
      <div
        style={{
          color: "#7dd3fc",
          fontSize: 12,
          fontWeight: 900,
          marginBottom: 18,
        }}
      >
        AKTIVITÄTSVERLAUF
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {activities.map((activity) => (
          <div
            key={activity.id}
            style={{
              display: "grid",
              gridTemplateColumns: "36px 1fr auto",
              gap: 12,
              alignItems: "center",
              paddingBottom: 14,
              borderBottom: "1px solid rgba(148,163,184,.08)",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                display: "grid",
                placeItems: "center",
                background: "rgba(14,165,233,.08)",
                color: "#7dd3fc",
                fontWeight: 900,
              }}
            >
              {icon[activity.type] || "•"}
            </div>

            <div
              style={{
                color: "#e2e8f0",
                fontWeight: 700,
              }}
            >
              {activity.message}
            </div>

            <div
              style={{
                color: "#64748b",
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              {new Intl.DateTimeFormat("de-CH", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(activity.createdAt))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
