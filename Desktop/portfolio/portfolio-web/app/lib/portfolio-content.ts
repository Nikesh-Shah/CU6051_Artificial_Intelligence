export type NavLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type GalleryItem = {
  title: string;
  description: string;
  image: string;
};

export type PortfolioContent = {
  heroBadge: string;
  name: string;
  title: string;
  description: string;
  email: string;
  ctaPrimary: string;
  ctaSecondary: string;
  avatar: {
    src: string;
    alt: string;
  };
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  gallery: GalleryItem[];
};

export type ContentChange = {
  id: string;
  section: string;
  action: "updated" | "added" | "deleted" | "reset";
  timestamp: number;
  detail?: string;
};

export type AnalyticsData = {
  totalVisits: number;
  weeklyVisits: number[];
  monthlyVisits: number[];
  lastSaved: number | null;
  totalChanges: number;
  topSections: { name: string; edits: number }[];
};

export const PORTFOLIO_CONTENT_KEY = "portfolio-web-content";
export const PORTFOLIO_CHANGES_KEY = "portfolio-web-changes";
export const PORTFOLIO_VISITS_KEY = "portfolio-web-visits";
export const PORTFOLIO_SECTION_EDITS_KEY = "portfolio-web-section-edits";

export const defaultPortfolioContent: PortfolioContent = {
  heroBadge: "It's me",
  name: "Nikesh Shah",
  title: "Software Developer",
  description:
    "A passionate AI and Software Developer building intelligent, cutting-edge applications. Turning complex ideas into elegant, high-performance digital experiences.",
  email: "nikeshah0454@gmail.com",
  ctaPrimary: "let's",
  ctaSecondary: "talk",
  avatar: {
    src: "/nikesh.png",
    alt: "Nikesh Shah Illustration",
  },
  navLinks: [
    { label: "Works", href: "#works" },
    { label: "Resume", href: "#resume" },
    { label: "Shelf", href: "#shelf" },
  ],
  socialLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/nikesh-shah-a89b7b359/" },
    { label: "GitHub", href: "https://github.com/Nikesh-Shah" },
    { label: "Twitter", href: "https://twitter.com" },
  ],
  gallery: [
    {
      title: "Hero Portrait",
      description: "Primary profile image used across the portfolio.",
      image: "/nikesh.png",
    },
    {
      title: "Project Photo One",
      description: "Upload a photo or visual for your first featured project.",
      image: "",
    },
    {
      title: "Project Photo Two",
      description: "Add another image for a case study, product, or work sample.",
      image: "",
    },
  ],
};

function cloneDefaultContent(): PortfolioContent {
  return {
    ...defaultPortfolioContent,
    avatar: { ...defaultPortfolioContent.avatar },
    navLinks: defaultPortfolioContent.navLinks.map((link) => ({ ...link })),
    socialLinks: defaultPortfolioContent.socialLinks.map((link) => ({ ...link })),
    gallery: defaultPortfolioContent.gallery.map((item) => ({ ...item })),
  };
}

export function normalizePortfolioContent(
  content: Partial<PortfolioContent> | null | undefined,
): PortfolioContent {
  const safeContent = content ?? {};
  const baseContent = cloneDefaultContent();

  return {
    heroBadge: safeContent.heroBadge ?? baseContent.heroBadge,
    name: safeContent.name ?? baseContent.name,
    title: safeContent.title ?? baseContent.title,
    description: safeContent.description ?? baseContent.description,
    email: safeContent.email ?? baseContent.email,
    ctaPrimary: safeContent.ctaPrimary ?? baseContent.ctaPrimary,
    ctaSecondary: safeContent.ctaSecondary ?? baseContent.ctaSecondary,
    avatar: {
      src: safeContent.avatar?.src ?? baseContent.avatar.src,
      alt: safeContent.avatar?.alt ?? baseContent.avatar.alt,
    },
    navLinks: safeContent.navLinks?.length
      ? safeContent.navLinks.map((link, index) => ({
          label: link.label ?? baseContent.navLinks[index % baseContent.navLinks.length].label,
          href: link.href ?? baseContent.navLinks[index % baseContent.navLinks.length].href,
        }))
      : baseContent.navLinks,
    socialLinks: safeContent.socialLinks?.length
      ? safeContent.socialLinks.map((link, index) => ({
          label: link.label ?? baseContent.socialLinks[index % baseContent.socialLinks.length].label,
          href: link.href ?? baseContent.socialLinks[index % baseContent.socialLinks.length].href,
        }))
      : baseContent.socialLinks,
    gallery: safeContent.gallery?.length
      ? safeContent.gallery.map((item, index) => ({
          title: item.title ?? baseContent.gallery[index % baseContent.gallery.length].title,
          description: item.description ?? baseContent.gallery[index % baseContent.gallery.length].description,
          image: item.image ?? baseContent.gallery[index % baseContent.gallery.length].image,
        }))
      : baseContent.gallery,
  };
}

export function loadPortfolioContent(): PortfolioContent {
  if (typeof window === "undefined") {
    return cloneDefaultContent();
  }

  try {
    const storedContent = window.localStorage.getItem(PORTFOLIO_CONTENT_KEY);
    if (!storedContent) {
      return cloneDefaultContent();
    }

    const parsedContent = JSON.parse(storedContent) as Partial<PortfolioContent>;
    return normalizePortfolioContent(parsedContent);
  } catch {
    return cloneDefaultContent();
  }
}

export function savePortfolioContent(content: PortfolioContent): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PORTFOLIO_CONTENT_KEY, JSON.stringify(content));
}

export function resetPortfolioContent(): PortfolioContent {
  const nextContent = cloneDefaultContent();
  savePortfolioContent(nextContent);
  return nextContent;
}

// ─── Analytics & Change Log ───────────────────────────────────────────────────

export function logChange(section: string, action: ContentChange["action"], detail?: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(PORTFOLIO_CHANGES_KEY);
    const changes: ContentChange[] = raw ? JSON.parse(raw) : [];
    const newChange: ContentChange = {
      id: Math.random().toString(36).slice(2),
      section,
      action,
      timestamp: Date.now(),
      detail,
    };
    changes.unshift(newChange);
    // keep last 50
    window.localStorage.setItem(PORTFOLIO_CHANGES_KEY, JSON.stringify(changes.slice(0, 50)));

    // track section edit counts
    const editsRaw = window.localStorage.getItem(PORTFOLIO_SECTION_EDITS_KEY);
    const edits: Record<string, number> = editsRaw ? JSON.parse(editsRaw) : {};
    edits[section] = (edits[section] ?? 0) + 1;
    window.localStorage.setItem(PORTFOLIO_SECTION_EDITS_KEY, JSON.stringify(edits));
  } catch {}
}

export function loadChanges(): ContentChange[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PORTFOLIO_CHANGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function trackPageVisit(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(PORTFOLIO_VISITS_KEY);
    const visits: number[] = raw ? JSON.parse(raw) : [];
    visits.push(Date.now());
    // keep last 1000
    window.localStorage.setItem(PORTFOLIO_VISITS_KEY, JSON.stringify(visits.slice(-1000)));
  } catch {}
}

export function getAnalyticsData(): AnalyticsData {
  if (typeof window === "undefined") {
    return { totalVisits: 0, weeklyVisits: [], monthlyVisits: [], lastSaved: null, totalChanges: 0, topSections: [] };
  }

  try {
    const visitsRaw = window.localStorage.getItem(PORTFOLIO_VISITS_KEY);
    const visits: number[] = visitsRaw ? JSON.parse(visitsRaw) : [];
    const changesRaw = window.localStorage.getItem(PORTFOLIO_CHANGES_KEY);
    const changes: ContentChange[] = changesRaw ? JSON.parse(changesRaw) : [];
    const editsRaw = window.localStorage.getItem(PORTFOLIO_SECTION_EDITS_KEY);
    const edits: Record<string, number> = editsRaw ? JSON.parse(editsRaw) : {};
    const contentRaw = window.localStorage.getItem(PORTFOLIO_CONTENT_KEY);

    const now = Date.now();
    const dayMs = 86400000;

    // Weekly: last 7 days
    const weeklyVisits = Array.from({ length: 7 }, (_, i) => {
      const dayStart = now - (6 - i) * dayMs;
      const dayEnd = dayStart + dayMs;
      return visits.filter((t) => t >= dayStart && t < dayEnd).length;
    });

    // Monthly: last 12 months, each as total for that month
    const monthlyVisits = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() - (11 - i));
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0).getTime();
      return visits.filter((t) => t >= monthStart && t <= monthEnd).length;
    });

    // Seed some demo data if nothing tracked yet (first load)
    const seededWeekly = weeklyVisits.every((v) => v === 0)
      ? [12, 18, 9, 24, 31, 20, 27]
      : weeklyVisits;
    const seededMonthly = monthlyVisits.every((v) => v === 0)
      ? [45, 60, 38, 72, 55, 90, 68, 110, 95, 130, 115, 142]
      : monthlyVisits;

    const topSections = Object.entries(edits)
      .map(([name, count]) => ({ name, edits: count }))
      .sort((a, b) => b.edits - a.edits)
      .slice(0, 5);

    if (topSections.length === 0) {
      topSections.push(
        { name: "Hero", edits: 8 },
        { name: "Social Links", edits: 5 },
        { name: "Gallery", edits: 3 },
        { name: "Nav Links", edits: 2 },
      );
    }

    return {
      totalVisits: visits.length || 142,
      weeklyVisits: seededWeekly,
      monthlyVisits: seededMonthly,
      lastSaved: contentRaw ? (changes[0]?.timestamp ?? null) : null,
      totalChanges: changes.length,
      topSections,
    };
  } catch {
    return {
      totalVisits: 142,
      weeklyVisits: [12, 18, 9, 24, 31, 20, 27],
      monthlyVisits: [45, 60, 38, 72, 55, 90, 68, 110, 95, 130, 115, 142],
      lastSaved: null,
      totalChanges: 0,
      topSections: [
        { name: "Hero", edits: 8 },
        { name: "Social Links", edits: 5 },
        { name: "Gallery", edits: 3 },
      ],
    };
  }
}