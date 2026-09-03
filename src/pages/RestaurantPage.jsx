import { useState } from "react";
import { Link } from "react-router-dom";
import { menu, money, site } from "../config/site";
import { Hero, card } from "./shared";

export function Restaurant() {
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(menu.map((item) => item.category))];
  const selected =
    category === "All"
      ? menu
      : menu.filter((item) => item.category === category);
  return (
    <>
      <Hero
        eyebrow="Dining"
        title={site.restaurant.name}
        copy={site.restaurant.description}
        image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80"
      >
        <Link
          to="/restaurant/reservation"
          className="mt-8 inline-block rounded-xl bg-amber-400 px-6 py-3 font-bold text-stone-950"
        >
          Reserve a table
        </Link>
      </Hero>
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="flex flex-wrap gap-3">
          {categories.map((item) => (
            <button
              onClick={() => setCategory(item)}
              key={item}
              className={`rounded-full px-4 py-2 text-sm ${category === item ? "bg-amber-400 font-bold text-stone-950" : "border border-white/15 text-stone-300"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {selected.map((item) => (
            <article className={`${card} overflow-hidden`} key={item.id}>
              <img
                src={item.image}
                alt={item.name}
                className="h-48 w-full object-cover"
                loading="lazy"
              />
              <div className="p-5">
                <div className="flex justify-between gap-3">
                  <h2 className="font-serif text-xl text-white">{item.name}</h2>
                  <strong className="text-amber-200">
                    {money(item.price)}
                  </strong>
                </div>
                <p className="mt-3 text-sm leading-6 text-stone-400">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className={`${card} mt-12 grid gap-6 p-7 md:grid-cols-2`}>
          <div>
            <h2 className="font-serif text-2xl text-white">Opening hours</h2>
            <ul className="mt-4 space-y-2 text-stone-300">
              {site.restaurant.hours.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-white">In your room</h2>
            <p className="mt-4 text-stone-400">
              Hotel guests can order the room-service menu directly to their
              room.
            </p>
            <Link
              className="mt-5 inline-block text-amber-200"
              to="/room-service"
            >
              Order room service →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
