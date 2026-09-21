import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
import LegalDocument from "@/components/sections/LegalDocument";
import Footer from "@/components/sections/Footer";
import { LEGAL_LAST_UPDATED, TERMS_SECTIONS } from "@/lib/legal";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "The terms that govern your access to and use of the Project Help website and services.",
  path: "/terms-of-service",
});

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main id="main">
        <LegalDocument
          title="Terms of Service"
          intro="The terms governing your access to and use of this website and the services described on it."
          lastUpdated={LEGAL_LAST_UPDATED}
          sections={TERMS_SECTIONS}
        />
      </main>
      <Footer />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Terms of Service", path: "/terms-of-service" },
        ])}
      />
    </>
  );
}
