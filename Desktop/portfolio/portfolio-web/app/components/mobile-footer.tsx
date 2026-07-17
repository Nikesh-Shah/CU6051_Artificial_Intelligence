import { SocialLink } from "../lib/portfolio-content";
import { SocialIcon } from "./social-icon";

export function MobileFooter({ socialLinks }: { socialLinks: SocialLink[] }) {
  return (
    <footer className="w-full md:hidden flex justify-center items-center gap-8 py-8 border-t z-20 transition-colors border-zinc-200/40 dark:border-zinc-800/40">
      {socialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors text-zinc-400 hover:text-[#cc6c5c] dark:text-zinc-500 dark:hover:text-[#cc6c5c]"
          aria-label={link.label}
        >
          <SocialIcon label={link.label} />
        </a>
      ))}
    </footer>
  );
}
