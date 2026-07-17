import { NavLink } from "../lib/portfolio-content";
import { NavIcon } from "./nav-icon";

type MobileBottomNavProps = {
  navLinks: NavLink[];
  email: string;
  toggleDarkMode: () => void;
};

export function MobileBottomNav({ navLinks, email, toggleDarkMode }: MobileBottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-4 py-3 border-t backdrop-blur-lg bg-zinc-50/90 dark:bg-[#09090b]/90 border-zinc-200/60 dark:border-zinc-800/60">
      {navLinks.map((link, index) => (
        <a
          key={link.label + index}
          href={link.href}
          className="flex flex-col items-center gap-0.5 text-[11px] font-semibold transition-colors text-zinc-500 hover:text-[#cc6c5c] dark:text-zinc-400 dark:hover:text-[#cc6c5c]"
        >
          <NavIcon index={index} />
          <span>{link.label}</span>
        </a>
      ))}
      <button
        onClick={toggleDarkMode}
        className="flex flex-col items-center gap-0.5 text-[11px] font-semibold transition-colors text-zinc-500 hover:text-[#cc6c5c] dark:text-zinc-400 dark:hover:text-[#cc6c5c]"
        aria-label="Toggle dark mode"
      >
        <svg className="w-5 h-5 transition-transform duration-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Theme</span>
      </button>
      <a
        href={`mailto:${email}`}
        className="flex flex-col items-center gap-0.5 text-[11px] font-semibold transition-colors text-zinc-500 hover:text-[#cc6c5c] dark:text-zinc-400 dark:hover:text-[#cc6c5c]"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span>Email</span>
      </a>
    </nav>
  );
}
