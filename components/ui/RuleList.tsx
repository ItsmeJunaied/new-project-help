type RuleListProps = {
  title: string;
  /** Orange-square list — used by the service and about pages. */
  items?: string[];
  /** Plain paragraph — used by the case study pages. */
  body?: string;
  className?: string;
  contentClassName?: string;
};

/**
 * The bordered block that sits beside a page title — a hairline rule, a
 * heading, and either an orange-square list or a short paragraph.
 */
export default function RuleList({
  title,
  items,
  body,
  className = "",
  contentClassName = "lg:w-[257px]",
}: RuleListProps) {
  return (
    <div className={`flex items-center gap-[22px] ${className}`}>
      <span className="hidden w-px self-stretch bg-[#e3e3e3] lg:block" aria-hidden />

      <div className={`flex w-full flex-col items-start gap-[25px] ${contentClassName}`}>
        <p className="w-full font-display text-[32px] font-semibold leading-[46px] text-black lg:whitespace-nowrap">
          {title}
        </p>

        {items ? (
          <ul className="flex flex-col items-start gap-[16px]">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-[10px]">
                <span className="size-[11px] shrink-0 bg-primary-green" aria-hidden />
                <span className="font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-ash-dark lg:whitespace-nowrap">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        {body ? (
          <p className="font-body text-[16px] leading-[24px] tracking-[-0.16px] text-ash-dark lg:w-[319px]">
            {body}
          </p>
        ) : null}
      </div>
    </div>
  );
}
