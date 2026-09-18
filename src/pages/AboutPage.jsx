import { assets } from "../config/site";
import { Hero, STYLES } from "./shared";

const PROPERTY_PILLARS = [
  {
    title: "Curated Experiences",
    copy: "Every element of your stay is thoughtfully designed, from the architectural details of our suites to the personalized service provided by our dedicated concierge team.",
  },
  {
    title: "Locally Sourced",
    copy: "Our culinary program and interior aesthetics draw deep inspiration from the surrounding region, supporting local artisans, farmers, and creators.",
  },
  {
    title: "Sustainable Luxury",
    copy: "We balance premium hospitality with environmental stewardship, utilizing energy-efficient systems and zero-waste initiatives throughout the property.",
  },
];

export function About() {
  return (
    <>
      <Hero
        eyebrow="Our Philosophy"
        title="Redefining Modern Hospitality"
        copy="We believe that true luxury is found in the details—in spaces that inspire rest, dining that sparks joy, and service that anticipates your every need."
        image={assets.aboutHero}
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-24 md:grid-cols-3">
        {PROPERTY_PILLARS.map(({ title, copy }) => (
          <article className={`${STYLES.card} p-8 lg:p-10`} key={title}>
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/10 text-amber-400">
              <span className="font-serif text-2xl">✦</span>
            </div>
            <h2 className="font-serif text-2xl text-white">{title}</h2>
            <p className="mt-4 leading-relaxed text-stone-400">{copy}</p>
          </article>
        ))}
      </section>
      
      <section className="border-t border-white/5 bg-stone-900/30 py-24">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <h2 className="font-serif text-3xl text-white md:text-4xl">A Destination Unto Itself</h2>
          <p className="mt-6 text-lg leading-relaxed text-stone-300">
            Whether you are joining us for a weekend retreat, an executive off-site, or a milestone celebration, our property provides a secluded sanctuary designed to elevate every moment.
          </p>
        </div>
      </section>
    </>
  );
}