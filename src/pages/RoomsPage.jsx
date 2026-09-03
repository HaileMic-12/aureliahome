import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { money, rooms } from "../config/site";
import { Hero, card } from "./shared";

export function RoomCard({ room }) {
  return (
    <article className={`${card} overflow-hidden`}>
      <img
        src={room.image}
        alt={room.name}
        className="h-64 w-full object-cover"
        loading="lazy"
      />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-serif text-2xl text-white">{room.name}</h2>
          <strong className="whitespace-nowrap text-amber-200">
            {money(room.price)}
            <span className="text-xs font-normal text-stone-400"> / night</span>
          </strong>
        </div>
        <p className="mt-3 text-sm leading-6 text-stone-400">
          {room.description}
        </p>
        <p className="mt-4 text-sm text-stone-300">
          {room.capacity} guests · {room.bed}
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            to={`/rooms/${room.id}`}
            className="text-sm font-semibold text-amber-200 hover:text-amber-100"
          >
            Details
          </Link>
          <Link
            to={`/book?room=${room.id}`}
            className="text-sm font-semibold text-white hover:text-amber-200"
          >
            Book →
          </Link>
        </div>
      </div>
    </article>
  );
}

export function Rooms() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...new Set(rooms.map((room) => room.category))];
  const listing =
    filter === "All" ? rooms : rooms.filter((room) => room.category === filter);
  return (
    <>
      <Hero
        eyebrow="Rooms & suites"
        title="Spaces with a sense of place"
        copy="Replace the room catalog in one data file; cards, booking choices, and detail pages stay in sync."
        image={rooms[1].image}
      />
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="flex flex-wrap gap-3" aria-label="Room categories">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`rounded-full px-4 py-2 text-sm ${filter === category ? "bg-amber-400 font-bold text-stone-950" : "border border-white/15 text-stone-300 hover:bg-white/5"}`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
  const room = rooms.find((item) => item.id === roomId);
  if (!room) return <Navigate to="/rooms" replace />;
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:py-20">
      <div className="grid gap-10 lg:grid-cols-2">
        <img
          src={room.image}
          alt={room.name}
          className="h-[460px] w-full rounded-3xl object-cover"
        />
        <div>
          <p className="text-xs font-bold uppercase tracking-[.25em] text-amber-300">
            {room.category}
          </p>
          <h1 className="mt-3 font-serif text-5xl text-white">{room.name}</h1>
          <p className="mt-6 text-lg leading-8 text-stone-300">
            {room.description}
          </p>
          <div
            className={`${card} mt-8 grid grid-cols-2 gap-4 p-6 text-sm text-stone-300`}
          >
            <span>
              From{" "}
              <strong className="block text-xl text-amber-200">
                {money(room.price)}
              </strong>{" "}
              per night
            </span>
            <span>
              Size{" "}
              <strong className="block text-xl text-white">{room.size}</strong>
            </span>
            <span>
              Capacity{" "}
              <strong className="block text-xl text-white">
                {room.capacity} guests
              </strong>
            </span>
            <span>
              Bed{" "}
              <strong className="block text-xl text-white">{room.bed}</strong>
            </span>
          </div>
          <h2 className="mt-8 font-serif text-2xl text-white">Included</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 text-sm text-stone-300">
            {room.amenities.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>
          <Link
            to={`/book?room=${room.id}`}
            className="mt-9 inline-block rounded-xl bg-amber-400 px-6 py-3 font-bold text-stone-950 hover:bg-amber-300"
          >
            Check availability
          </Link>
        </div>
      </div>
    </section>
  );
}
