import { Link } from "react-router-dom";
import { assets, rooms, site, testimonials } from "../config/site";
import { Hero, SectionTitle, STYLES, Button } from "./shared";
import { RoomCard } from "./RoomsPage";

// Extracted static configurations outside the component to prevent reallocation on every render
const PROPERTY_FEATURES = [
  {
    title: "Thoughtful stays",
    copy: "A flexible room catalog, practical pricing, and an intuitive guest booking flow.",
  },
  {
    title: "Seasonal dining",
    copy: "A configurable restaurant menu, real-time table reservations, and in-room dining integration.",
  },
  {
    title: "Gather well",
    copy: "Distinctive event spaces with a dedicated inquiry and management workflow.",
  },
];

export function Home() {
  const featuredRooms = rooms.filter((room) => room.featured);

  return (
    <>
      <Hero
        eyebrow="Boutique Hospitality Platform"
        title={site.tagline || "Welcome to Aurelia"}
        copy="A sophisticated digital presence for distinctive hotels, premium resorts, and exclusive event venues."
        image={assets.homeHero}
      >
        <div className="mt-9 flex flex-wrap gap-4">
          <Link to="/book">
            <Button variant="primary">Plan a stay</Button>
          </Link>
          <Link to="/rooms">
            <Button variant="outline">Explore rooms</Button>
          </Link>
        </div>
      </Hero>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-20 md:grid-cols-3">
        {PROPERTY_FEATURES.map(({ title, copy }) => (
          <article className={`${STYLES.card} p-8`} key={title}>
            <h2 className="font-serif text-2xl text-white">{title}</h2>
            <p className="mt-4 leading-relaxed text-stone-400">{copy}</p>
          </article>
        ))}
      </section>

      <section className="border-y border-white/5 bg-stone-900/40 py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle
              eyebrow="Accommodation"
              title="Designed for deep rest"
            />
            <Link 
              className="group flex items-center text-sm font-semibold text-amber-400 transition-colors hover:text-amber-300" 
              to="/rooms"
            >
              View all rooms 
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {featuredRooms.map((room) => (
              <RoomCard room={room} key={room.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24">
        <SectionTitle
          eyebrow="Guest Notes"
          title="The details make the stay"
          align="center"
        />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <blockquote key={index} className={`${STYLES.card} flex flex-col justify-between p-8`}>
              <p className="text-lg leading-relaxed text-stone-200">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-8 border-t border-white/10 pt-4 text-sm font-medium text-amber-400">
                {item.name} <span className="mx-2 text-stone-600">|</span> <span className="font-normal text-stone-400">{item.context}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </>
  );
}