import { Link } from "react-router-dom";
import { site } from "../config/site";
import { SectionTitle } from "../components/Layout";

// Centralized styles allow for easier overriding and a more unified design system
export const STYLES = {
  card: "rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm transition-all hover:bg-white/10",
  input: "mt-2 w-full rounded-xl border border-white/20 bg-stone-900/50 px-4 py-3 text-white placeholder-stone-500 outline-none transition-colors focus:border-amber-400 focus:bg-stone-900",
};

export const Button = ({ children, disabled, variant = "primary", className = "", ...props }) => {
  const baseStyles = "inline-flex justify-center items-center rounded-xl px-6 py-3 font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 active:scale-95";
  
  const variants = {
    primary: "bg-amber-400 text-stone-950 hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/20",
    secondary: "bg-stone-800 text-white hover:bg-stone-700 border border-white/10",
    outline: "bg-transparent border-2 border-amber-400 text-amber-400 hover:bg-amber-400/10",
  };

  return (
    <button
      {...props}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Field = ({ label, children, hint, className = "" }) => (
  <label className={`block text-sm font-medium text-stone-200 ${className}`}>
    {label}
    {children}
    {hint && (
      <span className="mt-1.5 block text-xs font-normal text-stone-400">
        {hint}
      </span>
    )}
  </label>
);

export const Hero = ({ eyebrow, title, copy, image, children }) => (
  <section className="relative isolate flex min-h-[60vh] items-center overflow-hidden border-b border-white/10">
    <img
      src={image}
      alt="Hero background"
      className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40 mix-blend-overlay"
    />
    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/20" />
    <div className="mx-auto w-full max-w-7xl px-5 py-24 md:py-32">
      <SectionTitle eyebrow={eyebrow} title={title} copy={copy} />
      {children && <div className="mt-8 animate-fade-in-up">{children}</div>}
    </div>
  </section>
);

export const formatDate = (value) => {
  if (!value) return "Select a date";
  const [year, month, day] = value.split('-');
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat(site.locale || 'en-US', { 
    dateStyle: "medium" 
  }).format(date);
};

export const today = new Date().toISOString().split('T')[0];

export { SectionTitle };

export function Confirmation({ title, reference, copy }) {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl items-center px-5 py-24 text-center">
      <div className={`${STYLES.card} w-full p-12`}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-400/20 text-3xl text-amber-400">
          ✓
        </div>
        <h1 className="mt-6 font-serif text-3xl text-white md:text-4xl">{title}</h1>
        <p className="mt-4 leading-relaxed text-stone-300">{copy}</p>
        
        {reference && (
          <div className="mt-8 rounded-xl bg-black/40 p-5 border border-white/5">
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">Confirmation Reference</p>
            <p className="font-mono text-lg font-bold text-amber-300">
              {reference}
            </p>
          </div>
        )}
        
        <Link
          to="/"
          className="mt-10 inline-block font-medium text-amber-400 transition-colors hover:text-amber-300 hover:underline underline-offset-4"
        >
          ← Return to homepage
        </Link>
      </div>
    </section>
  );
}