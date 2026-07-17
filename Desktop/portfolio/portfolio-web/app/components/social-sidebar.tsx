import { SocialLink } from "../lib/portfolio-content";
import { SocialIcon } from "./social-icon";

export function SocialSidebar({ socialLinks }: { socialLinks: SocialLink[] }) {
  return (
    <aside className="fixed left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-6 z-30">
      {socialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-200 hover:scale-110 text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200"
          aria-label={link.label}
        >
          <SocialIcon label={link.label} />
        </a>
      ))}
    </aside>
  );
}
