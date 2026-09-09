export default function InvoiceReminderHistory({
  reminderLevel = 0,
  firstReminderAt,
  secondReminderAt,
  reminderFeeCents = 0,
}: {
  reminderLevel?: number;
  firstReminderAt?: Date | string | null;
  secondReminderAt?: Date | string | null;
  reminderFeeCents?: number;
}) {
  const date = (value?: Date | string | null) => {
    if (!value) return "Noch nicht versendet";

    return new Intl.DateTimeFormat("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  };

  const money = new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(reminderFeeCents / 100);

  return (
    <section
      style={{
        marginTop: 18,
        border: "1px solid rgba(148,163,184,.14)",
        borderRadius: 20,
        padding: 24,
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
        MAHNUNGSVERLAUF
      </div>

      <div
        style={{
          display: "grid",
          gap: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            paddingBottom: 14,
            borderBottom: "1px solid rgba(148,163,184,.10)",
          }}
        >
          <div>
            <div style={{ fontWeight: 800 }}>1. Zahlungserinnerung</div>
            <div
              style={{
                color: "#94a3b8",
                fontSize: 13,
                marginTop: 4,
              }}
            >
              {date(firstReminderAt)}
            </div>
          </div>

          <div
            style={{
              color: reminderLevel >= 1 ? "#86efac" : "#94a3b8",
              fontWeight: 900,
            }}
          >
            {reminderLevel >= 1 ? "✓ Gesendet" : "Offen"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            paddingBottom: 14,
            borderBottom: "1px solid rgba(148,163,184,.10)",
          }}
        >
          <div>
            <div style={{ fontWeight: 800 }}>2. Mahnung</div>
            <div
              style={{
                color: "#94a3b8",
                fontSize: 13,
                marginTop: 4,
              }}
            >
              {date(secondReminderAt)}
            </div>
          </div>

          <div
            style={{
              color: reminderLevel >= 2 ? "#fca5a5" : "#94a3b8",
              fontWeight: 900,
            }}
          >
            {reminderLevel >= 2 ? "✓ Gesendet" : "Offen"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div>
            <div style={{ fontWeight: 800 }}>Mahngebühr</div>
            <div
              style={{
                color: "#94a3b8",
                fontSize: 13,
                marginTop: 4,
              }}
            >
              Aktuell hinterlegte Gebühr
            </div>
          </div>

          <strong
            style={{
              color: reminderFeeCents > 0 ? "#fbbf24" : "#94a3b8",
            }}
          >
            {money}
          </strong>
        </div>
      </div>
    </section>
  );
}
