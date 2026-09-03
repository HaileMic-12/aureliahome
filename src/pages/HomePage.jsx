import { Link } from "react-router-dom";
import { rooms, site, testimonials } from "../config/site";
import { Hero, SectionTitle, card } from "./shared";
import { RoomCard } from "./RoomsPage";

export function Home() {
  return (
    <>
      <Hero
        eyebrow="Independent hotel template"
        title={site.tagline}
        copy="A polished starting point for distinctive hotels, resorts, restaurants, and event venues."
        image="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80"
      >
        <div className="mt-9 flex flex-wrap gap-4">
          <Link
            to="/book"
            className="rounded-xl bg-amber-400 px-6 py-3 font-bold text-stone-950 hover:bg-amber-300"
          >
            Plan a stay
          </Link>
          <Link
            to="/rooms"
            className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10"
          >
            Explore rooms
          </Link>
        </div>
      </Hero>
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-20 md:grid-cols-3">
        {[
          [
            "Thoughtful stays",
            "A flexible room catalog, practical pricing, and an honest booking flow.",
          ],
          [
            "Seasonal dining",
            "A configurable restaurant, reservations, and room-service ordering.",
          ],
          [
            "Gather well",
            "Distinctive event spaces with a real inquiry workflow.",
          ],
        ].map(([title, copy]) => (
          <article className={`${card} p-7`} key={title}>
            <h2 className="font-serif text-2xl text-white">{title}</h2>
            <p className="mt-3 leading-7 text-stone-400">{copy}</p>
          </article>
        ))}
      </section>
      <section className="bg-stone-900/60 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <SectionTitle
              eyebrow="Accommodation"
              title="Designed for deep rest"
            />
            <Link className="text-amber-300 hover:text-amber-200" to="/rooms">
              All rooms →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {rooms
              .filter((room) => room.featured)
              .map((room) => (
                <RoomCard room={room} key={room.id} />
              ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20">
        <SectionTitle
          eyebrow="Guest notes"
          title="The details make the stay"
          align="center"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote key={item.name} className={`${card} p-7`}>
              <p className="text-lg leading-8 text-stone-200">“{item.quote}”</p>
              <footer className="mt-5 text-sm text-amber-200">
                {item.name}{" "}
                <span className="text-stone-500">· {item.context}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </>
  );
}
