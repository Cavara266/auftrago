import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AnbieterLocalePage() {
  await headers();

  redirect("/anbieter?locale=en");
}
