import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OldLeadDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  redirect(`/portal/leads?lead=${encodeURIComponent(id)}`);
}
