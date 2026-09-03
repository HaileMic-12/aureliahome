import { useState } from "react";
import { site } from "../config/site";
import { SectionTitle } from "../components/Layout";
import { useFeedback } from "../components/Feedback";
import { createRecord } from "../services/records";
import { Button, card, Field, input } from "./shared";

export function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General inquiry",
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const { notify } = useFeedback();
  const submit = async (e) => {
    e.preventDefault();
    if (form.message.trim().length < 10) {
      notify("error", "Please write at least 10 characters.");
      return;
    }
    setBusy(true);
    try {
      await createRecord("messages", { ...form, status: "new" });
      notify("success", "Your message was received.");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "General inquiry",
        message: "",
      });
    } catch (error) {
      notify("error", error.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <SectionTitle
            eyebrow="Contact"
            title="We would love to hear from you"
            copy="Update all property information in the centralized site configuration."
          />
          <address className={`${card} mt-8 not-italic p-7 text-stone-300`}>
            {site.address.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <a className="mt-5 block text-amber-200" href={`tel:${site.phone}`}>
              {site.phone}
            </a>
            <a
              className="mt-2 block text-amber-200"
              href={`mailto:${site.email}`}
            >
              {site.email}
            </a>
          </address>
          <iframe
            className="mt-6 h-80 w-full rounded-3xl border border-white/10"
            title="Property location"
            src={site.mapEmbedUrl}
            loading="lazy"
          />
        </div>
        <form
          onSubmit={submit}
          className={`${card} grid h-fit gap-5 p-7 md:grid-cols-2`}
        >
          <div className="md:col-span-2">
            <h1 className="font-serif text-3xl">Send a message</h1>
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
          <Field label="Subject">
            <select
              className={input}
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            >
              <option>General inquiry</option>
              <option>Reservation</option>
              <option>Event inquiry</option>
              <option>Accessibility</option>
            </select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Message">
              <textarea
                className={input}
                required
                rows="6"
                maxLength="2000"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </Field>
          </div>
          <Button disabled={busy}>
            {busy ? "Sending message…" : "Send message"}
          </Button>
        </form>
      </div>
    </section>
  );
}
