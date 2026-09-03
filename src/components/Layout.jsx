import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { site } from "../config/site";
import { createRecord } from "../services/records";
import { useFeedback } from "./Feedback";

const links = [
  ["Stay", "/rooms"],
  ["Dining", "/restaurant"],
  ["Events", "/events"],
  ["Gallery", "/gallery"],
  ["About", "/about"],
  ["Contact", "/contact"],
];
export function Layout() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const { notify } = useFeedback();
  const subscribe = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await createRecord("newsletterSubscribers", { email, status: "active" });
      setEmail("");
      notify("success", "You are subscribed.");
    } catch (error) {
      notify("error", error.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-stone-950/90 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
          <Link
            to="/"
            className="font-serif text-2xl tracking-wide"
            onClick={() => setOpen(false)}
          >
            {site.name}
          </Link>
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Primary"
          >
            {links.map(([name, path]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm ${isActive ? "text-amber-300" : "text-stone-300 hover:bg-white/5 hover:text-white"}`
                }
              >
                {name}
              </NavLink>
            ))}
            <Link
              to="/book"
              className="ml-3 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-bold text-stone-950 hover:bg-amber-300"
            >
              Book a stay
            </Link>
          </nav>
          <button
            aria-expanded={open}
            aria-label="Toggle navigation"
            className="rounded-lg p-2 text-xl lg:hidden"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>
        {open && (
          <nav
            className="border-t border-white/10 px-5 py-4 lg:hidden"
            aria-label="Mobile"
          >
            {links.map(([name, path]) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-stone-200 hover:bg-white/5"
              >
                {name}
              </NavLink>
            ))}
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="mt-3 block rounded-full bg-amber-400 px-5 py-3 text-center font-bold text-stone-950"
            >
              Book a stay
            </Link>
          </nav>
        )}
      </header>
      <main id="content">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 bg-stone-950">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="font-serif text-2xl text-white">
              {site.name}
            </Link>
            <p className="mt-4 text-sm leading-6 text-stone-400">
              {site.description}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-300">
              Explore
            </h2>
            <div className="mt-4 grid gap-2 text-sm text-stone-400">
              {links.slice(0, 4).map(([name, path]) => (
                <Link key={path} to={path} className="hover:text-amber-300">
                  {name}
                </Link>
              ))}
              <Link to="/privacy" className="hover:text-amber-300">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-amber-300">
                Terms
              </Link>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-300">
              Contact
            </h2>
            <address className="mt-4 not-italic text-sm leading-7 text-stone-400">
              {site.address.map((line) => (
                <div key={line}>{line}</div>
              ))}
              <a
                className="block hover:text-amber-300"
                href={`tel:${site.phone.replace(/\s/g, "")}`}
              >
                {site.phone}
              </a>
              <a
                className="block hover:text-amber-300"
                href={`mailto:${site.email}`}
              >
                {site.email}
              </a>
            </address>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-300">
              Updates
            </h2>
            <form onSubmit={subscribe} className="mt-4 space-y-3">
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm"
              />
              <button
                disabled={busy}
                className="w-full rounded-xl border border-amber-300 px-4 py-3 text-sm font-semibold text-amber-200 disabled:opacity-60"
              >
                {busy ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-white/10 px-5 py-6 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} {site.name}. Template demo
          content—replace before launch.
        </div>
      </footer>
    </div>
  );
}
export function SectionTitle({ eyebrow, title, copy, align = "left" }) {
  return (
    <div
      className={
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
      }
    >
      <p className="text-xs font-bold uppercase tracking-[.25em] text-amber-300">
        {eyebrow}
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-white md:text-5xl">
        {title}
      </h1>
      {copy && <p className="mt-5 leading-7 text-stone-300">{copy}</p>}
    </div>
  );
}
