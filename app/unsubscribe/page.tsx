import type { Metadata } from "next";

import Header from "@/components/sections/Header";
import UnsubscribeForm from "@/components/sections/UnsubscribeForm";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Remove your address from the Project Help newsletter.",
  // A utility page with nothing to rank for, and it takes a query parameter —
  // keeping it out of the index avoids indexing someone's email address.
  robots: { index: false, follow: false },
};

export default function UnsubscribePage() {
  return (
    <>
      <Header />
      <main id="main">
        <UnsubscribeForm />
      </main>
      <Footer />
    </>
  );
}
