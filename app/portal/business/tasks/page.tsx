import Link from "next/link";

import BusinessWorkflowBoard from "@/components/business/BusinessWorkflowBoard";
import BusinessTaskQueue from "@/components/business/BusinessTaskQueue";

export default async function BusinessTasksPage() {
  return (
    <main style={main}>
      <div style={shell}>
        <PageHeader
          eyebrow="AUFTRAGO WORKFLOW"
          title="Aufgaben"
          description="Offene Aufgaben, Prioritäten und automatisierte Business-Aktionen."
        />

        <BusinessTaskQueue />

        <div style={{ height: 26 }} />

        <BusinessWorkflowBoard />

        <div style={{ marginTop: 22 }}>
          <Link
            href="/portal/business"
            style={backLink}
          >
            ← Zurück zum Cockpit
          </Link>
        </div>
      </div>
    </main>
  );
}

function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={eyebrowStyle}>
        {eyebrow}
      </div>

      <h1 style={titleStyle}>
        {title}
      </h1>

      <p style={descriptionStyle}>
        {description}
      </p>
    </div>
  );
}

const main = {
  minHeight: "100vh",
  background: "#061120",
  color: "#f8fafc",
};

const shell = {
  width: "min(100%,1500px)",
  margin: "0 auto",
  padding: "34px 28px 80px",
  boxSizing: "border-box" as const,
};

const eyebrowStyle = {
  color: "#7dd3fc",
  fontSize: 10,
  fontWeight: 950,
  letterSpacing: ".10em",
};

const titleStyle = {
  margin: "8px 0 7px",
  fontSize: "clamp(38px,5vw,64px)",
  lineHeight: 1,
  letterSpacing: "-.05em",
};

const descriptionStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: 13,
};

const backLink = {
  color: "#7dd3fc",
  textDecoration: "none",
  fontSize: 10,
  fontWeight: 900,
};
