import type { ReactNode } from "react";

import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

type SeoLayoutProps = {
  breadcrumbs: BreadcrumbItem[];
  schema?: object | object[];
  children: ReactNode;
};

export default function SeoLayout({
  breadcrumbs,
  schema,
  children,
}: SeoLayoutProps) {
  return (
    <>
      {schema ? <JsonLd data={schema} /> : null}

      <main className="home-page premium-home">
        <div className="container pt-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {children}
      </main>
    </>
  );
}
