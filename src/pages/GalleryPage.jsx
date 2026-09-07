import { useState } from "react";
import { gallery } from "../config/site";
import { SectionTitle } from "../components/Layout";
import { card } from "./shared";

export function Gallery() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...new Set(gallery.map((item) => item.category))];
  const items =
    filter === "All"
      ? gallery
      : gallery.filter((item) => item.category === filter);
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <SectionTitle
        eyebrow="Gallery"
        title="A sense of the place"
        copy="This demo uses bundled local imagery. Replace it with your own licensed property photography before commercial launch."
      />
      <div className="mt-8 flex flex-wrap gap-3">
        {categories.map((item) => (
          <button
            onClick={() => setFilter(item)}
            key={item}
            className={`rounded-full px-4 py-2 text-sm ${filter === item ? "bg-amber-400 font-bold text-stone-950" : "border border-white/15 text-stone-300"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <figure key={item.id} className={`${card} overflow-hidden`}>
            <img
              src={item.image}
              alt={item.alt}
              className="h-72 w-full object-cover"
              loading="lazy"
            />
            <figcaption className="p-4 text-sm text-stone-300">
              {item.alt}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
