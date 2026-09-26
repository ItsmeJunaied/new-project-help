import type { ReactNode } from "react";

/**
 * The technology marks used by the stack section, drawn inline in brand colour.
 *
 * These are hand-drawn approximations, not the vendors' official artwork: close
 * enough to be recognised at the 22px they are rendered at, and small enough to
 * cost nothing. Swap any of them for the official SVG if an exact mark matters
 * — the shape of this file makes that a one-line change.
 */

export type TechName =
  | "react"
  | "nextjs"
  | "typescript"
  | "tailwind"
  | "flutter"
  | "nodejs"
  | "python"
  | "go"
  | "graphql"
  | "openai"
  | "postgres"
  | "mongodb"
  | "redis"
  | "elasticsearch"
  | "pytorch"
  | "aws"
  | "docker"
  | "kubernetes"
  | "terraform"
  | "vercel"
  | "figma"
  | "javascript";

const MARKS: Record<TechName, { label: string; art: ReactNode }> = {
  react: {
    label: "React",
    art: (
      <>
        <circle cx="12" cy="12" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse cx="12" cy="12" rx="10.4" ry="4.05" />
          <ellipse cx="12" cy="12" rx="10.4" ry="4.05" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10.4" ry="4.05" transform="rotate(120 12 12)" />
        </g>
      </>
    ),
  },
  nextjs: {
    label: "Next.js",
    art: (
      <>
        <circle cx="12" cy="12" r="11" fill="#0B0B0B" />
        <g stroke="#fff" strokeWidth="1.35" strokeLinecap="round">
          <path d="M8.5 7.9v8.2" />
          <path d="m8.5 7.9 8.1 10.8" />
          <path d="M15.6 7.9v6.4" />
        </g>
      </>
    ),
  },
  typescript: {
    label: "TypeScript",
    art: (
      <>
        <rect width="24" height="24" rx="3.2" fill="#3178C6" />
        <text
          x="12.4"
          y="16.6"
          textAnchor="middle"
          fill="#fff"
          fontSize="9.6"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          TS
        </text>
      </>
    ),
  },
  javascript: {
    label: "JavaScript",
    art: (
      <>
        <rect width="24" height="24" rx="3.2" fill="#F7DF1E" />
        <text
          x="12.4"
          y="16.6"
          textAnchor="middle"
          fill="#111"
          fontSize="9.6"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          JS
        </text>
      </>
    ),
  },
  tailwind: {
    label: "Tailwind CSS",
    art: (
      <path
        d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.61 7.15 14.5 6 12 6ZM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C10.61 13.15 9.5 12 7 12Z"
        fill="#38BDF8"
      />
    ),
  },
  flutter: {
    label: "Flutter",
    art: (
      <>
        <path d="M14.4 1.8 5.6 10.6l2.8 2.8L20 1.8Z" fill="#47C5FB" />
        <path d="M14.4 11.1 9.2 16.3l2.8 2.8 5.2-5.2Z" fill="#47C5FB" />
        <path d="m12 19.1 2.6 2.7H20l-5.4-5.4Z" fill="#00569E" />
      </>
    ),
  },
  nodejs: {
    label: "Node.js",
    art: (
      <>
        <path d="M12 1.7 21.3 7v10L12 22.3 2.7 17V7Z" fill="#5FA04E" />
        <path d="M12 6.3 17.3 9.3v5.9L12 18.2l-5.3-3V9.3Z" fill="#fff" fillOpacity=".34" />
      </>
    ),
  },
  python: {
    label: "Python",
    art: (
      <>
        <path
          d="M11.9 2c-2.4 0-4.3.9-4.3 2.9v2.3h4.6V8H5.6c-2 0-2.9 1.9-2.9 4.3s.9 4.3 2.9 4.3h1.6V14c0-2 1.7-3.6 3.7-3.6h4.6c1.6 0 2.9-1.3 2.9-2.9V4.9C18.4 3.3 16.5 2 14.1 2Zm-2.5 1.6a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9Z"
          fill="#3776AB"
        />
        <path
          d="M12.1 22c2.4 0 4.3-.9 4.3-2.9v-2.3h-4.6V16h6.6c2 0 2.9-1.9 2.9-4.3s-.9-4.3-2.9-4.3h-1.6V10c0 2-1.7 3.6-3.7 3.6H8.5c-1.6 0-2.9 1.3-2.9 2.9v2.6c0 1.6 1.9 2.9 4.3 2.9Zm2.5-1.6a.95.95 0 1 1 0-1.9.95.95 0 0 1 0 1.9Z"
          fill="#FFD43B"
        />
      </>
    ),
  },
  go: {
    label: "Go",
    art: (
      <>
        <rect width="24" height="24" rx="3.2" fill="#00ADD8" />
        <text
          x="12.2"
          y="16.6"
          textAnchor="middle"
          fill="#fff"
          fontSize="9.6"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          Go
        </text>
      </>
    ),
  },
  graphql: {
    label: "GraphQL",
    art: (
      <>
        <g stroke="#E10098" strokeWidth="1" fill="none">
          <path d="M12 3.2 20 7.6v8.8L12 20.8 4 16.4V7.6Z" />
          <path d="M12 3.2 4 16.4m8-13.2 8 13.2M4 7.6h16" />
        </g>
        <g fill="#E10098">
          <circle cx="12" cy="3.2" r="1.75" />
          <circle cx="20" cy="7.6" r="1.75" />
          <circle cx="20" cy="16.4" r="1.75" />
          <circle cx="12" cy="20.8" r="1.75" />
          <circle cx="4" cy="16.4" r="1.75" />
          <circle cx="4" cy="7.6" r="1.75" />
        </g>
      </>
    ),
  },
  openai: {
    label: "OpenAI",
    art: (
      <>
        <circle cx="12" cy="12" r="11" fill="#0B0B0B" />
        <g stroke="#fff" strokeWidth="1.1" fill="none" strokeLinejoin="round">
          <path d="M12 6.4 16.9 9.2v5.6L12 17.6 7.1 14.8V9.2Z" />
          <path d="M12 6.4V12l4.9 2.8M12 12l-4.9 2.8" />
        </g>
      </>
    ),
  },
  postgres: {
    label: "PostgreSQL",
    art: (
      <>
        <ellipse cx="12" cy="5.8" rx="8.2" ry="3.1" fill="#336791" />
        <path
          d="M3.8 5.8v12.4c0 1.7 3.7 3.1 8.2 3.1s8.2-1.4 8.2-3.1V5.8c0 1.7-3.7 3.1-8.2 3.1S3.8 7.5 3.8 5.8Z"
          fill="#336791"
        />
        <path
          d="M3.8 12c0 1.7 3.7 3.1 8.2 3.1s8.2-1.4 8.2-3.1"
          stroke="#fff"
          strokeOpacity=".5"
          strokeWidth="1"
          fill="none"
        />
      </>
    ),
  },
  mongodb: {
    label: "MongoDB",
    art: (
      <>
        <path
          d="M12 1.8c2.7 3.3 5.1 6.2 5.1 10.1 0 3.5-2.2 6.2-4.3 7.3l-.3 3h-1l-.3-3c-2.1-1.1-4.3-3.8-4.3-7.3C6.9 8 9.3 5.1 12 1.8Z"
          fill="#47A248"
        />
        <path d="M12 4.4v15" stroke="#fff" strokeOpacity=".55" strokeWidth=".9" />
      </>
    ),
  },
  redis: {
    label: "Redis",
    art: (
      <g fill="#DC382D">
        <ellipse cx="12" cy="6.2" rx="9" ry="3.2" />
        <path d="M3 9.8c0 1.8 4 3.2 9 3.2s9-1.4 9-3.2v2.5c0 1.8-4 3.2-9 3.2s-9-1.4-9-3.2Z" />
        <path d="M3 14.8c0 1.8 4 3.2 9 3.2s9-1.4 9-3.2v2.3c0 1.8-4 3.2-9 3.2s-9-1.4-9-3.2Z" />
      </g>
    ),
  },
  elasticsearch: {
    label: "Elasticsearch",
    art: (
      <>
        <path d="M4.2 6.2h12.2a7 7 0 0 0-5.3-3.4H7.6A10 10 0 0 0 4.2 6.2Z" fill="#F0BF1A" />
        <path d="M2.7 9.4h13.7a6.6 6.6 0 0 1 .5 2.6 6.6 6.6 0 0 1-.5 2.6H2.7a10.2 10.2 0 0 1 0-5.2Z" fill="#07A5DE" />
        <path d="M4.2 17.8h12.2a7 7 0 0 1-5.3 3.4H7.6a10 10 0 0 1-3.4-3.4Z" fill="#3EBEB0" />
        <path d="M17.8 8.1a4 4 0 0 1 0 7.8Z" fill="#F04E98" />
      </>
    ),
  },
  pytorch: {
    label: "PyTorch",
    art: (
      <g fill="#EE4C2C">
        <path d="M15.6 5.6a7.6 7.6 0 1 1-10.7 0L7 7.7a4.6 4.6 0 1 0 6.5 0Z" />
        <path d="M14.5 2.1 11.7 4.9l2.8 2.8Z" />
        <circle cx="14.7" cy="7.4" r="1.15" fill="#fff" />
      </g>
    ),
  },
  aws: {
    label: "AWS",
    art: (
      <>
        <text
          x="12"
          y="12.4"
          textAnchor="middle"
          fill="#232F3E"
          fontSize="8"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          aws
        </text>
        <path
          d="M3.4 16c2.7 1.9 6.5 2.9 9.7 2.5 2-.2 4-.9 5.6-2.1"
          stroke="#FF9900"
          strokeWidth="1.7"
          strokeLinecap="round"
          fill="none"
        />
        <path d="m17.4 15.1 3.4.2-1.9 2.6Z" fill="#FF9900" />
      </>
    ),
  },
  docker: {
    label: "Docker",
    art: (
      <g fill="#2496ED">
        <rect x="4.6" y="10.8" width="3.1" height="3.1" rx=".4" />
        <rect x="8.2" y="10.8" width="3.1" height="3.1" rx=".4" />
        <rect x="11.8" y="10.8" width="3.1" height="3.1" rx=".4" />
        <rect x="8.2" y="7.3" width="3.1" height="3.1" rx=".4" />
        <rect x="11.8" y="7.3" width="3.1" height="3.1" rx=".4" />
        <rect x="11.8" y="3.8" width="3.1" height="3.1" rx=".4" />
        <path d="M2.2 15.1h16.4c.5 1.7-.4 3.1-1.9 3.8-1.4.6-3.2.8-4.9.7-3-.2-5.7-1.1-7.6-2.4-.9-.6-1.6-1.3-2-2.1Z" />
        <path d="M17.3 12.4c1-.8 1.9-.6 2.5.1.4-1 1.1-1.3 1.9-1.2-.5 1.8-2.2 2.7-3.8 2.4Z" />
      </g>
    ),
  },
  kubernetes: {
    label: "Kubernetes",
    art: (
      <>
        <path d="M12 2.1 19.7 5.8l1.9 8.3-5.3 6.6H7.7l-5.3-6.6 1.9-8.3Z" fill="#326CE5" />
        <circle cx="12" cy="11.9" r="2.2" fill="#fff" />
        <g stroke="#fff" strokeWidth="1.05" strokeLinecap="round">
          <path d="M12 5.2v2.6M17.7 9.1l-2.5 1.3M15.7 17.1l-1.4-2.4M8.3 17.1l1.4-2.4M6.3 9.1l2.5 1.3" />
        </g>
      </>
    ),
  },
  terraform: {
    label: "Terraform",
    art: (
      <g fill="#7B42BC">
        <path d="M3.8 4.3 8.9 7.2v5.9L3.8 10.2Z" />
        <path d="M9.7 7.7l5.1 2.9v5.9l-5.1-2.9Z" />
        <path d="M15.6 10.6 20.7 7.7v5.9l-5.1 2.9Z" />
        <path d="M9.7 14.5l5.1 2.9v5.9l-5.1-2.9Z" fillOpacity=".55" />
      </g>
    ),
  },
  vercel: {
    label: "Vercel",
    art: <path d="M12 3.4 22.4 20.6H1.6Z" fill="#0B0B0B" />,
  },
  figma: {
    label: "Figma",
    art: (
      <>
        <path d="M8.7 2.2H12v5.2H8.7a2.6 2.6 0 0 1 0-5.2Z" fill="#F24E1E" />
        <path d="M12 2.2h3.3a2.6 2.6 0 0 1 0 5.2H12Z" fill="#FF7262" />
        <path d="M12 7.4h3.3a2.6 2.6 0 0 1 0 5.2H12Z" fill="#1ABCFE" />
        <path d="M8.7 7.4H12v5.2H8.7a2.6 2.6 0 0 1 0-5.2Z" fill="#A259FF" />
        <path d="M12 12.6v2.6a2.6 2.6 0 1 1-2.6-2.6Z" fill="#0ACF83" />
      </>
    ),
  },
};

export function techLabel(name: TechName) {
  return MARKS[name].label;
}

export default function TechMark({
  name,
  className = "",
}: {
  name: TechName;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      {MARKS[name].art}
    </svg>
  );
}
