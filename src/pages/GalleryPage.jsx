import { useState, useMemo } from "react";
import { gallery } from "../config/site";
import { SectionTitle } from "../components/Layout";
import { STYLES } from "./shared";

export function Gallery() {
  const [filter, setFilter] = useState("All");
  
  const categories = useMemo(
    () => ["All", ...new Set(gallery.map((item) => item.category))],
    []
  );
  
  const items = useMemo(
    () => filter === "All" ? gallery : gallery.filter((item) => item.category === filter),
    [filter]
  );

  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <SectionTitle
          eyebrow="Property Gallery"
          title="A sense of the place"
          copy="Explore the architecture, interior design, and surrounding landscapes that make every stay unforgettable."
          align="center"
        />
      </div>
      
      <div className="mt-12 flex flex-wrap items-center justify-center gap-3" aria-label="Gallery categories">
        {categories.map((item) => (
          <button
            onClick={() => setFilter(item)}
            key={item}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
              filter === item 
                ? "bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20" 
                : "border border-white/15 text-stone-300 hover:border-amber-400/50 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <figure key={item.id} className={`${STYLES.card} group overflow-hidden`}>
            <div className="relative overflow-hidden">
              <img
                src={item.image}
                alt={item.alt}
                className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <figcaption className="absolute bottom-0 left-0 w-full translate-y-4 p-6 text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {item.alt}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}