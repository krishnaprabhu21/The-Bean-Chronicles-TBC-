import { Link } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/recipes", label: "Recipes" },
  { to: "/brewing-guides", label: "Brewing Guides" },
  { to: "/culture", label: "Culture" },
  { to: "/about", label: "About" },
  { to: "/play",  label: "Play" },
];

export function Footer() {
  return (
    <footer
      className="mt-8 relative"
      style={{
        borderTop: "1px solid rgba(80,120,60,0.16)",
        background: "#0A140C",
      }}
    >
      <div className="w-full max-w-[1600px] mx-auto px-9 sm:px-9 xl:px-15 py-8 sm:py-3">
        {/* Main row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
          {/* Wordmark */}
          <div className="flex flex-col leading-none">
            <span
              className="font-display font-bold text-lg tracking-tight"
              style={{ color: "#E8DFD0", fontSize: "0.95rem" }}
            >
              The Bean Chronicles
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-9 gap-y-3">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-200"
                style={{
                  color: "rgba(232,223,208,0.62)",
                  fontFamily: "Inter, sans-serif",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(232,223,208,0.62)")
                }
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3"
          style={{ borderTop: "1px solid rgba(80,120,60,0.14)" }}
        >
          <p
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "11px",
              letterSpacing: "0.12em",
              color: "rgba(201,168,76,0.5)",
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
              color: "rgba(201,168,76,0.5)",
            }}
          >
            Made with ☕&❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
