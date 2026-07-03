import Link from "next/link";

export type NavLink = { href: string; label: string };

type Props = {
  homeHref: string;
  homeLabel: string;
  links: NavLink[];
};

export function Header({ homeHref, homeLabel, links }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={homeHref}
          className="shrink-0 font-heading text-lg font-bold text-ink-strong"
        >
          {homeLabel}
        </Link>
        <nav
          aria-label="Navigation principale"
          className="flex items-center gap-1 overflow-x-auto sm:gap-2"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink-strong"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
