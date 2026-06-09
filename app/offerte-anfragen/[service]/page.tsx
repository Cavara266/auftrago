import { redirect } from "next/navigation";

type Props = {
  params: {
    service: string;
  };
};

export default function OfferteAnfragenServiceRedirectPage({ params }: Props) {
  const service = params.service;

  if (service) {
    redirect(`/offerte-anfragen?service=${encodeURIComponent(service)}`);
  }

  redirect("/offerte-anfragen");
}