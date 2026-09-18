import { useState, useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { money, rooms } from "../config/site";
import { Hero, STYLES, Button } from "./shared";

export function RoomCard({ room }) {
  return (
    <article className={`${STYLES.card} group flex flex-col overflow-hidden`}>
      <div className="relative overflow-hidden">
        <img
          src={room.image}
          alt={room.name}
          className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-serif text-2xl text-white">{room.name}</h2>
          <div className="flex flex-col items-end">
            <strong className="text-lg text-amber-400">{money(room.price)}</strong>
            <span className="text-xs font-normal text-stone-400">per night</span>
          </div>
        </div>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-stone-400">
          {room.description}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wider text-stone-300">
          <span>{room.capacity} guests</span>
          <span className="h-1 w-1 rounded-full bg-stone-600" aria-hidden="true"></span>
          <span>{room.bed}</span>
        </div>
        <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
          <Link
            to={`/rooms/${room.id}`}
            className="flex-1 text-center text-sm font-semibold text-white transition-colors hover:text-amber-400"
          >
            View Details
          </Link>
          <Link to={`/book?room=${room.id}`} className="flex-1">
            <Button variant="primary" className="w-full py-2.5 text-sm">
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

export function Rooms() {
  const [filter, setFilter] = useState("All");
  
  // Memoize data derived from state/config to prevent unnecessary recalculations during renders
  const categories = useMemo(() => ["All", ...new Set(rooms.map((room) => room.category))], []);
  const listing = useMemo(() => filter === "All" ? rooms : rooms.filter((room) => room.category === filter), [filter]);

  return (
    <>
      <Hero
        eyebrow="Rooms & Suites"
        title="Spaces with a sense of place"
        copy="Explore our collection of thoughtfully designed accommodations, blending modern comfort with timeless elegance."
        image={rooms[1]?.image}
      />
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start" aria-label="Filter rooms by category">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                filter === category 
                  ? "bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20" 
                  : "border border-white/15 text-stone-300 hover:border-amber-400/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {listing.map((room) => (
            <RoomCard room={room} key={room.id} />
          ))}
        </div>
      </section>
    </>
  );
}

export function RoomDetail() {
  const { roomId } = useParams();
  const room = useMemo(() => rooms.find((item) => item.id === roomId), [roomId]);
  
  if (!room) return <Navigate to="/rooms" replace />;
  
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <img
            src={room.image}
            alt={room.name}
            className="h-[500px] w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
        </div>
        
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-[.2em] text-amber-400">
            {room.category}
          </p>
          <h1 className="mt-4 font-serif text-4xl text-white md:text-5xl">{room.name}</h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-300">
            {room.description}
          </p>
          
          <div className={`${STYLES.card} mt-10 grid grid-cols-2 gap-y-6 gap-x-4 p-8 text-sm text-stone-400`}>
            <div>
              <span className="mb-1 block text-xs uppercase tracking-wider">Starting from</span>
              <strong className="text-2xl font-normal text-amber-400">{money(room.price)}</strong>
              <span className="ml-1">/ night</span>
            </div>
            <div>
              <span className="mb-1 block text-xs uppercase tracking-wider">Room Size</span>
              <strong className="text-xl font-normal text-white">{room.size}</strong>
            </div>
            <div>
              <span className="mb-1 block text-xs uppercase tracking-wider">Capacity</span>
              <strong className="text-xl font-normal text-white">{room.capacity} guests</strong>
            </div>
            <div>
              <span className="mb-1 block text-xs uppercase tracking-wider">Bed Type</span>
              <strong className="text-xl font-normal text-white">{room.bed}</strong>
            </div>
          </div>
          
          <div className="mt-10">
            <h2 className="border-b border-white/10 pb-4 font-serif text-2xl text-white">Amenities & Features</h2>
            <ul className="mt-6 grid grid-cols-2 gap-4 text-sm text-stone-300">
              {room.amenities.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-amber-400" aria-hidden="true">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-12 border-t border-white/10 pt-8">
            <Link to={`/book?room=${room.id}`}>
              <Button variant="primary" className="w-full px-10 md:w-auto">
                Check Availability
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}