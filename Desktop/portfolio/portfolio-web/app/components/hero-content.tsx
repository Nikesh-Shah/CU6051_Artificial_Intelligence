type HeroContentProps = {
  content: {
    heroBadge: string;
    name: string;
    title: string;
    description: string;
    email: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  badgeVisible: boolean;
  typedPrimary: string;
  typedSecondary: string;
  nameDone: boolean;
  showTitle: boolean;
  showDesc: boolean;
  showCta: boolean;
};
export function HeroContent({ content, badgeVisible, typedPrimary, typedSecondary, nameDone, showTitle, showDesc, showCta }: HeroContentProps) {
  return (
    <div className="col-span-1 md:col-span-5 flex flex-col items-start relative select-none">
      <div
        className="relative mb-6"
        style={{
          opacity: badgeVisible ? undefined : 0,
          animation: badgeVisible
            ? "hero-reveal 1.6s cubic-bezier(0.16, 1, 0.3, 1) both"
            : "none",
        }}
      >
        <div style={{ animation: "badge-tilt 2.5s ease-in-out infinite", transformOrigin: "center" }}>
          <div className="text-white font-semibold text-[15px] px-5 py-2.5 rounded-[5px] shadow-md select-none tracking-wide transition-colors bg-[#222222] dark:bg-zinc-800">
            {content.heroBadge}
          </div>
          <div className="absolute bottom-[-4px] left-6 w-3 h-3 rotate-45 transition-colors bg-[#222222] dark:bg-zinc-800" />
        </div>
      </div>

      <h1 className="text-[44px] sm:text-6xl md:text-[72px] font-extrabold leading-[1.08] tracking-tight mb-2 transition-colors text-zinc-700 dark:text-zinc-100">
        {typedPrimary || <span className="opacity-0">N</span>}
        <br />
        {typedSecondary || <span className="opacity-0">S</span>}
        {!nameDone && <span className="cursor" />}
      </h1>

      <h2
        className="text-xs sm:text-[13px] font-extrabold tracking-[0.18em] uppercase mb-8 mt-1 text-zinc-500 dark:text-zinc-400"
        style={{
          opacity: showTitle ? undefined : 0,
          animation: showTitle
            ? "hero-reveal 1.6s cubic-bezier(0.16, 1, 0.3, 1) both"
            : "none",
        }}
      >
        {content.title}
      </h2>

      <p className="text-[13px] sm:text-sm leading-relaxed max-w-[340px] mb-10 font-medium text-zinc-500 dark:text-zinc-400">
        {content.description.split(" ").map((word, i) => (
          <span
            key={i}
            style={
              showDesc
                ? {
                    display: "inline",
                    animation: `word-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 42}ms both`,
                  }
                : { opacity: 0 }
            }
          >
            {word}{" "}
          </span>
        ))}
      </p>

      <a
        href={`mailto:${content.email}`}
        className="relative flex items-center justify-center p-3 rounded-full border hover:scale-105 active:scale-95 group shadow-sm border-[#cc6c5c]/10 bg-[#cc6c5c]/[0.03] hover:bg-[#cc6c5c]/[0.06] dark:bg-[#cc6c5c]/[0.01] dark:hover:bg-[#cc6c5c]/[0.05]"
        style={{
          opacity: showCta ? undefined : 0,
          animation: showCta
            ? "hero-reveal 1.6s cubic-bezier(0.16, 1, 0.3, 1) both"
            : "none",
          pointerEvents: showCta ? "auto" : "none",
        }}
      >
        <div
          className="w-24 h-24 rounded-full bg-[#cc6c5c] hover:bg-[#c35e4e] flex flex-col items-center justify-center text-white text-[15px] font-semibold leading-tight transition-colors duration-300"
          style={{ animation: showCta ? "pulse-ring 1.8s ease-out infinite" : "none" }}
        >
          <span className="tracking-tight select-none">{content.ctaPrimary}</span>
          <span className="tracking-tight select-none">{content.ctaSecondary}</span>
        </div>
        <div className="absolute inset-0 rounded-full border border-[#cc6c5c]/25 scale-100 group-hover:scale-110 transition-transform duration-500" />
      </a>
    </div>
  );
}
