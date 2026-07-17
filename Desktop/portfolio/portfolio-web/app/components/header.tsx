import { NavLink } from "../lib/portfolio-content";
import { NavIcon } from "./nav-icon";

type HeaderProps = {
  email: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  navLinks: NavLink[];
};

export function Header({ email, isDarkMode, toggleDarkMode, navLinks }: HeaderProps) {
  return (
    <header className="w-full max-w-7xl mx-auto px-6 py-6 md:py-8 flex items-center justify-between z-20">
      <div className="flex items-center">
        <a href="#" className="group transition-opacity hover:opacity-95 text-xl sm:text-[25px] font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          NIKESH<span className="text-[#cc6c5c]">.DEV</span>
        </a>
      </div>

      <div className="flex items-center gap-5 transition-colors">
        <a href={`mailto:${email}`} className="flex items-center gap-2 text-[16px] sm:text-[21px] font-semibold hover:text-[#cc6c5c] transition-colors text-zinc-700 dark:text-zinc-300 dark:hover:text-[#cc6c5c]">
          <svg className="w-6 h-6 transition-colors text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="hidden sm:inline">{email}</span>
        </a>
        <div className="w-[1px] h-5 transition-colors bg-zinc-300 dark:bg-zinc-800" />
        <button
          onClick={toggleDarkMode}
          className="p-1 rounded-full transition-colors focus:outline-none relative group text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          aria-label="Toggle dark mode"
        >
          <svg className="w-6 h-6 transition-transform duration-500 group-hover:rotate-90" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <nav className="hidden md:flex items-center gap-4 sm:gap-6">
        {navLinks.map((link, index) => (
          <a key={link.label + index} href={link.href} className="flex items-center gap-1.5 text-base sm:text-[17px] font-semibold transition-colors group text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50">
            <NavIcon index={index} />
            <span>{link.label}</span>
          </a>
        ))}
      </nav>
    </header>
  );
}
