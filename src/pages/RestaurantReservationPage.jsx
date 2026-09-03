import { useState } from "react";
import { useFeedback } from "../components/Feedback";
import { createRecord } from "../services/records";
import {
  Button,
  card,
  Confirmation,
  Field,
  input,
  SectionTitle,
  today,
} from "./shared";

export function RestaurantReservation() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "19:00",
    guests: 2,
    seating: "No preference",
    requests: "",
  });
  const [busy, setBusy] = useState(false);
  const [ref, setRef] = useState("");
  const { notify } = useFeedback();
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    if (form.date < today) {
      notify("error", "Choose a future reservation date.");
      return;
    }
    setBusy(true);
    try {
      const id = await createRecord("restaurantReservations", {
        ...form,
        status: "pending",
      });
      setRef(`TABLE-${id.slice(0, 8).toUpperCase()}`);
      notify("success", "Table request received.");
    } catch (error) {
      notify("error", error.message);
    } finally {
      setBusy(false);
    }
  };
  return ref ? (
    <Confirmation
      title="Table request received"
      reference={ref}
      copy="Your table is requested, not confirmed. The restaurant team will review availability."
    />
  ) : (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <SectionTitle
        eyebrow="Restaurant reservations"
        title="Save your table"
        copy="A reservation is confirmed only after the restaurant team accepts it."
      />
      <form
        onSubmit={submit}
        className={`${card} mt-9 grid gap-5 p-6 md:grid-cols-2`}
      >
        <Field label="Full name">
          <input
            className={input}
            required
            name="name"
            value={form.name}
            onChange={change}
          />
        </Field>
        <Field label="Email">
          <input
            className={input}
            required
            type="email"
            name="email"
            value={form.email}
            onChange={change}
          />
        </Field>
        <Field label="Phone">
          <input
            className={input}
            required
            type="tel"
            name="phone"
            value={form.phone}
            onChange={change}
          />
        </Field>
        <Field label="Guests">
          <input
            className={input}
            required
            min="1"
            max="20"
            type="number"
            name="guests"
            value={form.guests}
            onChange={change}
          />
        </Field>
        <Field label="Date">
          <input
            className={input}
            required
            min={today}
            type="date"
            name="date"
            value={form.date}
            onChange={change}
          />
        </Field>
        <Field label="Time">
          <input
            className={input}
            required
            type="time"
            name="time"
            value={form.time}
            onChange={change}
          />
        </Field>
        <Field label="Seating">
          <select
            className={input}
            name="seating"
            value={form.seating}
            onChange={change}
          >
            <option>No preference</option>
            <option>Dining room</option>
            <option>Terrace</option>
            <option>Window table</option>
          </select>
        </Field>
        <Field label="Requests">
          <textarea
            className={input}
            maxLength="1000"
            rows="3"
            name="requests"
            value={form.requests}
            onChange={change}
          />
        </Field>
        <Button className="md:col-span-2" disabled={busy}>
          {busy ? "Sending request…" : "Request a table"}
        </Button>
      </form>
    </section>
  );
}
