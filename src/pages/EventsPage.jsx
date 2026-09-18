import { useState } from "react";
import { events, money } from "../config/site";
import { useFeedback } from "../components/Feedback";
import { createRecord } from "../services/records";
import {
  Button,
  STYLES,
  Field,
  Hero,
  SectionTitle,
  today,
} from "./shared";

const INITIAL_FORM_STATE = {
  name: "",
  email: "",
  phone: "",
  eventDate: "",
  guests: "",
  venue: "",
  details: "",
};

export function Events() {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [busy, setBusy] = useState(false);
  const { notify } = useFeedback();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.eventDate < today) {
      return notify("error", "Please select a future date for your event.");
    }

    setBusy(true);
    try {
      await createRecord("eventInquiries", { ...form, status: "new" });
      notify("success", "Your event inquiry has been successfully submitted. Our team will contact you shortly.");
      setForm(INITIAL_FORM_STATE);
    } catch (error) {
      notify("error", error.message || "Failed to submit inquiry.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Hero
        eyebrow="Private Events & Gatherings"
        title="A gathering with presence"
        copy="Elevate your next celebration, private dinner, or corporate retreat in our thoughtfully designed architectural spaces."
        image={events[0]?.image}
      />
      
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((item) => (
            <article key={item.id} className={`${STYLES.card} group flex flex-col overflow-hidden`}>
              <div className="relative overflow-hidden">
                <img
                  className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                  {item.category}
                </p>
                <h2 className="mt-3 font-serif text-2xl text-white">{item.name}</h2>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-stone-400">
                  {item.description}
                </p>
                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6 text-sm">
                  <span className="text-stone-300">Up to {item.capacity} guests</span>
                  <span className="font-medium text-amber-400">From {money(item.price)}/day</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={`${STYLES.card} mt-20 p-8 md:p-12 lg:p-16`}>
          <div className="mx-auto max-w-2xl text-center">
            <SectionTitle
              eyebrow="Start a Conversation"
              title="Tell us what you are planning"
              copy="Provide a few details about your upcoming event, and our dedicated events team will prepare a tailored proposal."
              align="center"
            />
          </div>
          
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2"
          >
            <Field label="Full Name">
              <input
                className={STYLES.input}
                required
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Jane Doe"
              />
            </Field>

            <Field label="Email Address">
              <input
                className={STYLES.input}
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                placeholder="jane@example.com"
              />
            </Field>

            <Field label="Phone Number">
              <input
                className={STYLES.input}
                required
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
              />
            </Field>

            <Field label="Estimated Event Date">
              <input
                className={STYLES.input}
                required
                min={today}
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={handleInputChange}
              />
            </Field>

            <Field label="Estimated Guest Count">
              <input
                className={STYLES.input}
                required
                min="1"
                type="number"
                name="guests"
                value={form.guests}
                onChange={handleInputChange}
                placeholder="50"
              />
            </Field>

            <Field label="Preferred Venue">
              <select
                className={STYLES.input}
                name="venue"
                value={form.venue}
                onChange={handleInputChange}
              >
                <option value="">Undecided / Any suitable space</option>
                {events.map((item) => (
                  <option key={item.id} value={item.name}>{item.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Event Details & Requirements" className="md:col-span-2">
              <textarea
                className={STYLES.input}
                required
                rows="5"
                maxLength="1000"
                name="details"
                value={form.details}
                onChange={handleInputChange}
                placeholder="Tell us about the type of event, catering needs, seating arrangements, and any specific requests..."
              />
            </Field>

            <div className="md:col-span-2 md:mt-4">
              <Button variant="primary" className="w-full md:w-auto md:px-12" disabled={busy}>
                {busy ? "Submitting Inquiry..." : "Submit Event Inquiry"}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}