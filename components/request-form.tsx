import { services } from "@/lib/seo-data";

export default function RequestForm() {
  return (
    <form className="space-y-4">

      <div>
        <label className="block text-sm mb-1">Dienstleistung</label>
        <select className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700">
          {services.map((s) => (
            <option key={s} value={s}>
              {s.replace("-", " ")}
            </option>
          ))}
        </select>
      </div>

    </form>
  );
}