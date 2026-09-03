import { useState } from "react";
import { events, money } from "../config/site";
import { useFeedback } from "../components/Feedback";
import { createRecord } from "../services/records";
import {
  Button,
  card,
  Field,
  Hero,
  input,
  SectionTitle,
  today,
} from "./shared";

export function Events() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    guests: "",
    venue: "",
    details: "",
  });
  const [busy, setBusy] = useState(false);
  const { notify } = useFeedback();
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await createRecord("eventInquiries", { ...form, status: "new" });
      notify("success", "Your event inquiry was received.");
      setForm({
        name: "",
        email: "",
        phone: "",
        eventDate: "",
        guests: "",
        venue: "",
        details: "",
      });
    } catch (error) {
      notify("error", error.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <Hero
        eyebrow="Events"
        title="A gathering with presence"
        copy="For celebrations, private dining, off-sites, and meetings with a point of view."
        image={events[0].image}
      />
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {events.map((item) => (
            <article key={item.id} className={`${card} overflow-hidden`}>
              <img
                className="h-56 w-full object-cover"
                src={item.image}
                alt={item.name}
              />
              <div className="p-6">
                <p className="text-xs uppercase tracking-widest text-amber-200">
                  {item.category}
                </p>
                <h2 className="mt-2 font-serif text-2xl">{item.name}</h2>
                <p className="mt-3 text-sm leading-6 text-stone-400">
                  {item.description}
                </p>
                <p className="mt-5 text-sm text-stone-300">
                  {item.capacity} · From {money(item.price)} / day
                </p>
              </div>
            </article>
          ))}
        </div>
        <form
          onSubmit={submit}
          className={`${card} mt-16 grid gap-5 p-7 md:grid-cols-2`}
        >
          <div className="md:col-span-2">
            <SectionTitle
              eyebrow="Start a conversation"
              title="Tell us what you are planning"
            />
          </div>
          <Field label="Name">
            <input
              className={input}
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Email">
            <input
              className={input}
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <input
              className={input}
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="Event date">
            <input
              className={input}
              required
              min={today}
              type="date"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            />
          </Field>
          <Field label="Guests">
            <input
              className={input}
              required
              min="1"
              type="number"
              value={form.guests}
              onChange={(e) => setForm({ ...form, guests: e.target.value })}
            />
          </Field>
          <Field label="Venue">
            <select
              className={input}
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
            >
              <option value="">Any suitable space</option>
              {events.map((item) => (
                <option key={item.id}>{item.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Details">
            <textarea
              className={input}
              required
              rows="4"
              maxLength="1000"
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
            />
          </Field>
          <div className="flex items-end">
            <Button disabled={busy}>
              {busy ? "Sending inquiry…" : "Send inquiry"}
            </Button>
          </div>
        </form>
      </section>
    </>
  );
}
