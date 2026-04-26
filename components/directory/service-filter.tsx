import Link from "next/link";
import { services, cities } from "@/lib/seo-data";

export default function ServiceFilter() {
  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Services</h2>

      <div className="flex flex-wrap gap-3 mb-6">
        {services.map((service) => (
          <Link
            key={service}
            href={`/${service}-${cities[0]}`}
            className="bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-700"
          >
            {service}
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">Städte</h2>

      <div className="flex flex-wrap gap-3">
        {cities.map((city) => (
          <Link
            key={city}
            href={`/${services[0]}-${city}`}
            className="bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-700"
          >
            {city}
          </Link>
        ))}
      </div>
    </div>
  );
}