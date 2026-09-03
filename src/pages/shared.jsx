import { Link } from "react-router-dom";
import { site } from "../config/site";
import { SectionTitle } from "../components/Layout";

export const card =
  "rounded-3xl border border-white/10 bg-white/[.04] shadow-2xl";
export const input =
  "mt-2 w-full rounded-xl border border-white/15 bg-stone-950 px-4 py-3 text-white outline-none focus:border-amber-300";
export const Button = ({ children, disabled, className = "", ...props }) => (
  <button
    {...props}
    disabled={disabled}
    className={`rounded-xl bg-amber-400 px-5 py-3 font-bold text-stone-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);
export const Field = ({ label, children, hint }) => (
  <label className="block text-sm font-medium text-stone-200">
    {label}
    {children}
    {hint && (
      <span className="mt-1 block text-xs font-normal text-stone-500">
        {hint}
      </span>
    )}
  </label>
);
export const Hero = ({ eyebrow, title, copy, image, children }) => (
  <section className="relative isolate overflow-hidden border-b border-white/10">
    <img
      src={image}
      alt=""
      className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30"
    />
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950/40" />
    <div className="mx-auto max-w-7xl px-5 py-24 md:py-32">
      <SectionTitle eyebrow={eyebrow} title={title} copy={copy} />
      {children}
    </div>
  </section>
);
export const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat(site.locale, { dateStyle: "medium" }).format(
        new Date(`${value}T12:00:00`),
      )
    : "Choose a date";
export const today = new Date().toISOString().slice(0, 10);

export { SectionTitle };

export function Confirmation({ title, reference, copy }) {
  return (
    <section className="mx-auto max-w-xl px-5 py-24 text-center">
      <div className={`${card} p-10`}>
        <p className="text-4xl" aria-hidden="true">
          ✓
        </p>
        <h1 className="mt-5 font-serif text-4xl text-white">{title}</h1>
        <p className="mt-4 leading-7 text-stone-300">{copy}</p>
        <p className="mt-7 rounded-xl bg-amber-300/10 p-4 font-mono text-amber-200">
          {reference}
        </p>
        <Link
          to="/"
          className="mt-8 inline-block text-amber-200 hover:text-amber-100"
        >
          Return home
        </Link>
      </div>
    </section>
  );
}
