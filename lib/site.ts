import { BRAND_GREEN } from "@/lib/brand";

export const siteConfig = {
  name: "Project Help",
  tagline: "Custom Software Development Company",
  description:
    "Project Help is a custom software development company building SaaS platforms, eCommerce systems, cloud infrastructure and AI/ML applications for clients worldwide.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.projecthelpbd.com",
  email: "hello@projecthelpbd.com",
  phone: "+8801975005362",
  /** The same number, grouped for reading. Never use this one in a tel: href. */
  phoneDisplay: "+880 1975-005362",
  whatsappHref: "https://wa.me/8801975005362",
  founded: "2021",
  /** 30-minute intro call. Same link the current live site books against. */
  calendlyUrl: `https://calendly.com/hello-projecthelpbd/30min?primary_color=${BRAND_GREEN.replace("#", "").toLowerCase()}`,
  /** Google Maps embed for the office, carried over from the live site. */
  mapEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7301.5943081938485!2d90.41014659999999!3d23.790236600000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7302532b98d%3A0x2ae0056ef129cb1f!2sCodesk!5e0!3m2!1sen!2sbd!4v1785401887802!5m2!1sen!2sbd",
  address: {
    street: "3rd Floor, House 76/A, Road 11, Banani",
    locality: "Dhaka",
    postalCode: "1213",
    country: "BD",
    countryName: "Bangladesh",
  },
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61550310609210",
    linkedin: "https://www.linkedin.com/company/projecthelpbd",
    whatsapp: "https://wa.me/8801975005362",
  },
} as const;

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
] as const;

export const navLinks = [
  { label: "HOME", href: "/" },
  { label: "SERVICES", href: "/services" },
  { label: "ABOUT US", href: "/about" },
  { label: "CASE STUDY", href: "/case-study" },
  { label: "BLOG", href: "/blog" },
  { label: "CAREER", href: "/career" },
] as const;
