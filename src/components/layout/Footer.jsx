import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const mainLinks = [
  { to: "/", label: "Home" },
  { to: "/recipes", label: "Recipes" },
  { to: "/brewing-guides", label: "Guides" },
  { to: "/culture", label: "Culture" },
  { to: "/community", label: "Community Recipes" },
  { to: "/about", label: "About" },
  { to: "/play", label: "Play" },
];

const toolLinks = [
  { to: "/tools", label: "Tools Hub" },
  { to: "/tasting", label: "Tasting Notes" },
  { to: "/calculator", label: "Brew Calculator" },
  { to: "/glossary", label: "Coffee Glossary" },
  { to: "/compare", label: "Compare Methods" },
  { to: "/journal", label: "Brew Journal" },
  { to: "/shelf", label: "Reading Shelf" },
  { to: "/submit-recipe", label: "Submit Recipe" },
];

function NavLink({ to, label }) {
  return (
    <Link
      to={to}
      className="text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-200"
      style={{ color: "var(--color-text-muted)", fontFamily: "Inter, sans-serif" }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
    >
      {label}
    </Link>
  );
}

export function Footer() {
  useTheme(); // subscribe to theme changes so CSS vars re-render

  return (
    <footer
      className="mt-8 relative"
      style={{
        borderTop: "1px solid var(--color-border)",
        background: "var(--color-surface)",
      }}
    >
      <div className="w-full max-w-[1600px] mx-auto px-9 xl:px-15 py-8">
        {/* Main row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand */}
          <div>
            <span
              className="font-display font-bold text-lg tracking-tight block mb-2"
              style={{ color: "var(--color-accent)" }}
            >
              The Bean Chronicles
            </span>
            <p
              style={{
                color: "var(--color-text-faint)",
                fontSize: "11px",
                fontFamily: "Space Mono, monospace",
                letterSpacing: "0.1em",
                lineHeight: 1.9,
              }}
            >
              From origin to cup —<br />stories &amp; rituals for the<br />discerning coffee mind.
            </p>
          </div>

          {/* Main pages */}
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.2em] mb-4"
              style={{ color: "var(--color-accent-border)", fontFamily: "Space Mono, monospace" }}
            >
              Explore
            </p>
            <nav className="flex flex-wrap gap-x-6 gap-y-3">
              {mainLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} label={label} />
              ))}
            </nav>
          </div>

          {/* Tools */}
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.2em] mb-4"
              style={{ color: "var(--color-accent-border)", fontFamily: "Space Mono, monospace" }}
            >
              Tools
            </p>
            <nav className="flex flex-wrap gap-x-6 gap-y-3">
              {toolLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} label={label} />
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <p
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "11px",
              letterSpacing: "0.12em",
              color: "var(--color-text-faint)",
              textTransform: "uppercase",
            }}
          >
            © 2024 The Bean Chronicles · All rights reserved
          </p>
          <p
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "12px",
              letterSpacing: "0.1em",
              color: "var(--color-text-faint)",
            }}
          >
            Made with ☕&amp;❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
