import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
import LegalDocument from "@/components/sections/LegalDocument";
import Footer from "@/components/sections/Footer";
import { LEGAL_LAST_UPDATED, PRIVACY_SECTIONS } from "@/lib/legal";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How Project Help collects, uses, and protects your personal data across our website and services.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main id="main">
        <LegalDocument
          title="Privacy Policy"
          intro="How we collect, use, disclose and safeguard information when you visit this site, apply for a role, or engage us for services."
          lastUpdated={LEGAL_LAST_UPDATED}
          sections={PRIVACY_SECTIONS}
        />
      </main>
      <Footer />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ])}
      />
    </>
  );
}
