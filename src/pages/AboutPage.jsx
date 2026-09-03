import { Hero, card } from "./shared";

export function About() {
  return (
    <>
      <Hero
        eyebrow="About the template"
        title="Built to be made your own"
        copy="Aurelia House is neutral demo content, designed to be replaced—not mistaken for a real hotel or endorsement."
        image="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1800&q=80"
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-20 md:grid-cols-3">
        {[
          [
            "Configuration first",
            "Brand, contact details, currency, rooms, menus, events, gallery and policies are in src/config/site.js.",
          ],
          [
            "Firebase when ready",
            "Public actions are only persisted after a buyer connects their own Firebase project.",
          ],
          [
            "Honest demo",
            "The supplied labels, reviews and images are sample content. Replace them before deployment.",
          ],
        ].map(([title, copy]) => (
          <article className={`${card} p-7`} key={title}>
            <h2 className="font-serif text-2xl">{title}</h2>
            <p className="mt-4 leading-7 text-stone-400">{copy}</p>
          </article>
        ))}
      </section>
    </>
  );
}
