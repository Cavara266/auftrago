import { getSession } from "@/lib/auth";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <main>
      <div style={{ display: "none" }}>
        {session?.user?.email ?? "Nicht eingeloggt"}
      </div>
      {children}
    </main>
  );
}