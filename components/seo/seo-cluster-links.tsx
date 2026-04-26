import Link from "next/link";
import { cities, services } from "@/lib/seo-data";

type Props = {
  title?: string;
};

export default function SeoClusterLinks({ title }: Props) {
  return (
    <section className="py-16 px-6 text-white border-t border-gray-800">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-2xl font-bold mb-6 text-center">
          {title || "Beliebte Kombinationen"}
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          {services.slice(0, 6).map((service) =>
            cities.slice(0, 6).map((city) => (
              <Link
                key={`${service}-${city}`}
                href={`/${service}-${city}`}
                className="block bg-gray-900 p-4 rounded-xl border border-gray-800 hover:border-gray-600 transition"
              >
                <span className="capitalize">
                  {service.replace("-", " ")} in {city}
                </span>
              </Link>
            ))
          )}

        </div>
      </div>
    </section>
  );
}