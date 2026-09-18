import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { site } from "../config/site";
import { createRecord } from "../services/records";
import { useFeedback } from "./Feedback";

const NAVIGATION_LINKS = [
  ["Stay", "/rooms"],
  ["Dining", "/restaurant"],
  ["Events", "/events"],
  ["Gallery", "/gallery"],
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Track Status", "/track"],
];

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const { notify } = useFeedback();

  const handleSubscribe = async (event) => {
    event.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return notify("error", "Please provide a valid email address.");
    }

    setBusy(true);
    try {
      await createRecord("newsletterSubscribers", { email, status: "active" });
      setEmail("");
      notify("success", "Welcome to our guest list. You are now subscribed.");
    } catch (error) {
      notify("error", error.message || "Failed to process subscription.");
    } finally {
      setBusy(false);
    }
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen flex-col bg-stone-950 font-sans text-stone-100 selection:bg-amber-400/30">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-amber-400 focus:px-6 focus:py-3 focus:font-bold focus:text-stone-950 focus:outline-none"
      >
        Skip to main content
      </a>
      
      <header className="sticky top-0 z-50 border-b border-white/5 bg-stone-950/80 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link
            to="/"
            className="font-serif text-2xl tracking-wide text-white transition-opacity hover:opacity-80"
            onClick={closeMenu}
          >
            {site.name}
          </Link>
          
          <nav
            className="hidden items-center gap-2 lg:flex"
            aria-label="Primary Desktop Navigation"
          >
            {NAVIGATION_LINKS.map(([name, path]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-white/5 text-amber-400" 
                      : "text-stone-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {name}
              </NavLink>
            ))}
            
            <div className="ml-4 border-l border-white/10 pl-4">
              <Link
                to="/book"
                className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-6 py-2.5 text-sm font-bold text-stone-950 transition-all hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/20 active:scale-95"
              >
                Book a Stay
              </Link>
            </div>
          </nav>
          
          <button
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-300 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {mobileMenuOpen && (
          <nav
            className="absolute left-0 top-20 w-full border-b border-white/10 bg-stone-900/95 px-5 py-6 shadow-2xl backdrop-blur-xl lg:hidden"
            aria-label="Mobile Navigation"
          >
            <div className="flex flex-col gap-2">
              {NAVIGATION_LINKS.map(([name, path]) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
                      isActive 
                        ? "bg-amber-400/10 text-amber-400" 
                        : "text-stone-200 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  {name}
                </NavLink>
              ))}
              <Link
                to="/book"
                onClick={closeMenu}
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-amber-400 px-5 py-4 text-base font-bold text-stone-950 transition-colors hover:bg-amber-300"
              >
                Book a Stay
              </Link>
            </div>
          </nav>
        )}
      </header>
      
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      
      <footer className="border-t border-white/5 bg-stone-950 pt-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 md:grid-cols-2 md:px-8 lg:grid-cols-4">
          <div className="lg:pr-8">
            <Link to="/" className="font-serif text-3xl text-white transition-opacity hover:opacity-80">
              {site.name}
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-stone-400">
              {site.description || "A sanctuary of modern luxury and distinctive design. Experience hospitality redefined."}
            </p>
          </div>
          
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Explore
            </h2>
            <nav className="mt-6 flex flex-col gap-3 text-sm font-medium text-stone-400">
              {NAVIGATION_LINKS.slice(0, 4).map(([name, path]) => (
                <Link key={path} to={path} className="w-fit transition-colors hover:text-amber-400">
                  {name}
                </Link>
              ))}
              <div className="my-2 h-px w-8 bg-white/10" aria-hidden="true" />
              <Link to="/privacy" className="w-fit transition-colors hover:text-amber-400">
                Privacy Policy
              </Link>
              <Link to="/terms" className="w-fit transition-colors hover:text-amber-400">
                Terms of Service
              </Link>
            </nav>
          </div>
          
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Contact Us
            </h2>
            <address className="mt-6 not-italic text-sm leading-relaxed text-stone-400">
              <div className="mb-4">
                {site.address.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
              
              <div className="space-y-2">
                <a
                  className="flex items-center gap-2 transition-colors hover:text-amber-400"
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                >
                  <span aria-hidden="true">✆</span> {site.phone}
                </a>
                <a
                  className="flex items-center gap-2 transition-colors hover:text-amber-400"
                  href={`mailto:${site.email}`}
                >
                  <span aria-hidden="true">✉</span> {site.email}
                </a>
              </div>
            </address>
          </div>
          
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Guest Updates
            </h2>
            <p className="mt-6 text-sm text-stone-400">
              Subscribe to receive exclusive offers and seasonal announcements.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 space-y-3">
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full rounded-xl border border-white/10 bg-stone-900/50 px-4 py-3 text-sm text-white placeholder-stone-500 outline-none transition-colors focus:border-amber-400 focus:bg-stone-900"
              />
              <button
                disabled={busy}
                className="w-full rounded-xl border-2 border-amber-400 bg-transparent px-4 py-2.5 text-sm font-bold text-amber-400 transition-all hover:bg-amber-400 hover:text-stone-950 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
              >
                {busy ? "Subscribing..." : "Join Guest List"}
              </button>
            </form>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 bg-stone-950 px-5 py-8 text-center md:flex-row md:px-8">
          <p className="text-xs font-medium text-stone-500">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-xs text-stone-600">
            Engineered for Hospitality
          </p>
        </div>
      </footer>
    </div>
  );
}

export function SectionTitle({ eyebrow, title, copy, align = "left" }) {
  const isCenter = align === "center";
  return (
    <div className={`${isCenter ? "mx-auto text-center" : ""} max-w-2xl`}>
      {eyebrow && (
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {copy && (
        <p className={`mt-6 text-lg leading-relaxed text-stone-400 ${isCenter ? "mx-auto max-w-xl" : ""}`}>
          {copy}
        </p>
      )}
    </div>
  );
}