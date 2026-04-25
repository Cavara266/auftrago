import Link from "next/link";
import { getProvidersByService } from "@/lib/providers";

type ProviderGridProps = {
  service?: string;
};

export default function ProviderGrid({
  service = "Reinigung",
}: ProviderGridProps) {
  const providers = getProvidersByService(service);

  return (
    <div className="service-grid">
      {providers.map((provider) => (
        <article className="service-card" key={provider.id}>
          <h3>{provider.name}</h3>

          <p>
            {provider.city} · Bewertung {provider.rating}
          </p>

          <p>{provider.description}</p>

          <Link href="/auftrag-erstellen" className="btn btn-secondary">
            Offerte anfragen
          </Link>
        </article>
      ))}
    </div>
  );
}