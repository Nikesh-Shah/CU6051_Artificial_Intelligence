"use client";

import { useEffect, useState } from "react";
import { loadPortfolioContent, PortfolioContent } from "./lib/portfolio-content";
import { Header, SocialSidebar, HeroContent, HeroAvatar, MobileFooter, MobileBottomNav } from "./components";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [content, setContent] = useState<PortfolioContent>(() => loadPortfolioContent());

  const [badgeVisible, setBadgeVisible] = useState(false);
  const [typedPrimary, setTypedPrimary] = useState("");
  const [typedSecondary, setTypedSecondary] = useState("");
  const [nameDone, setNameDone] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
      setIsDarkMode(initialDark);
      document.documentElement.classList.toggle("dark", initialDark);

      const storedContent = localStorage.getItem("portfolio-web-content");
      if (storedContent && (storedContent.includes("kenjimmy17") || storedContent.includes("KEN") || !storedContent.includes("nikesh-shah-a89b7b359") || !storedContent.includes("Nikesh-Shah") || storedContent.includes("AI & Software Developer"))) {
        localStorage.removeItem("portfolio-web-content");
        setContent(loadPortfolioContent());
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      setContent(loadPortfolioContent());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    try {
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    } catch {
    }
  }, [isDarkMode]);

  useEffect(() => {
    const primary = content.name.split(" ").slice(0, 1).join(" ");
    const secondary = content.name.split(" ").slice(1).join(" ");
    const fullText = primary + "\n" + secondary;
    let i = 0;
    setBadgeVisible(false);
    setTypedPrimary("");
    setTypedSecondary("");
    setNameDone(false);
    setShowTitle(false);
    setShowDesc(false);
    setShowCta(false);

    const badgeTimer = setTimeout(() => setBadgeVisible(true), 150);

    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        const current = fullText.slice(0, i);
        const parts = current.split("\n");
        setTypedPrimary(parts[0] || "");
        setTypedSecondary(parts[1] || "");
        if (i >= fullText.length) {
          clearInterval(interval);
          setNameDone(true);
        }
      }, 95);
      return () => clearInterval(interval);
    }, 750);

    return () => { clearTimeout(badgeTimer); clearTimeout(startDelay); };
  }, [content.name]);

  useEffect(() => {
    if (!nameDone) return;
    const t1 = setTimeout(() => setShowTitle(true), 400);
    const t2 = setTimeout(() => setShowDesc(true), 800);
    const t3 = setTimeout(() => setShowCta(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [nameDone]);

  const toggleDarkMode = () => {
    setIsDarkMode((current) => !current);
  };

  const navLinks = content.navLinks.slice(0, 3);
  const socialLinks = content.socialLinks.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 relative overflow-x-hidden font-sans bg-zinc-50 text-zinc-900 dark:bg-[#09090b] dark:text-zinc-100 pb-20 md:pb-0">
      <style>{`
        @keyframes hero-reveal {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes word-reveal {
          from {
            opacity: 0;
            filter: blur(8px);
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            filter: blur(0px);
            transform: translateY(0px);
          }
        }
        @keyframes badge-tilt {
          0%   { transform: rotate(-4deg); }
          50%  { transform: rotate(4deg); }
          100% { transform: rotate(-4deg); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0px rgba(204,108,92,0.7), 0 4px 24px rgba(204,108,92,0.35); }
          70%  { box-shadow: 0 0 0 22px rgba(204,108,92,0),  0 4px 24px rgba(204,108,92,0.35); }
          100% { box-shadow: 0 0 0 0px rgba(204,108,92,0),   0 4px 24px rgba(204,108,92,0.35); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .cursor {
          display: inline-block;
          width: 3px;
          height: 0.82em;
          background: currentColor;
          margin-left: 4px;
          border-radius: 1px;
          vertical-align: middle;
          animation: blink 0.9s step-end infinite;
        }
      `}</style>

      <Header email={content.email} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} navLinks={navLinks} />
      <SocialSidebar socialLinks={socialLinks} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col justify-center py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-center">
          <HeroContent
            content={content}
            badgeVisible={badgeVisible}
            typedPrimary={typedPrimary}
            typedSecondary={typedSecondary}
            nameDone={nameDone}
            showTitle={showTitle}
            showDesc={showDesc}
            showCta={showCta}
          />
          <HeroAvatar avatar={content.avatar} />
        </div>
      </main>

      <MobileFooter socialLinks={socialLinks} />
      <MobileBottomNav navLinks={navLinks} email={content.email} toggleDarkMode={toggleDarkMode} />
    </div>
  );
}
