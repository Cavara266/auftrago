import Link from "next/link";
import { services, cities } from "@/lib/seo-data";

export default function ServicesGrid() {
  return (
    <section className="py-16 px-6 text-white">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Beliebte Dienstleistungen
      </h2>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {services.map((service) => (
          <div
            key={service}
            className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition"
          >
            <h3 className="text-xl font-semibold mb-2 capitalize">
              {service.replace("-", " ")}
            </h3>

            <p className="text-gray-400 mb-4">
              Finde die besten Anbieter für {service.replace("-", " ")} in deiner Stadt.
            </p>

            <Link
              href={`/${service}-${cities[0]}`}
              className="inline-block bg-white text-black px-4 py-2 rounded-lg font-medium hover:opacity-80"
            >
              Angebote ansehen
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}