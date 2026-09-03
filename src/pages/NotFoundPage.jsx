import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-5 py-28 text-center">
      <p className="text-xs uppercase tracking-[.25em] text-amber-300">404</p>
      <h1 className="mt-4 font-serif text-5xl">This page is not here.</h1>
      <Link className="mt-8 inline-block text-amber-200" to="/">
        Return home →
      </Link>
    </section>
  );
}
