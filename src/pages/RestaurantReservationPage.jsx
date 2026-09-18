import { useState } from "react";
import { useFeedback } from "../components/Feedback";
import { createRecord } from "../services/records";
import {
  Button,
  STYLES,
  Confirmation,
  Field,
  SectionTitle,
  today,
} from "./shared";

const INITIAL_FORM_STATE = {
  name: "",
  email: "",
  phone: "",
  date: "",
  time: "19:00",
  guests: 2,
  seating: "No preference",
  requests: "",
};

export function RestaurantReservation() {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState("");
  const { notify } = useFeedback();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.date < today) {
      return notify("error", "Please select a future reservation date.");
    }
    
    if (form.phone.trim().length < 7) {
      return notify("error", "Please enter a valid phone number.");
    }

    setBusy(true);
    try {
      const recordId = await createRecord("restaurantReservations", {
        ...form,
        status: "pending",
      });
      
      // Professional ID generation: DINE-YYYYMMDD-ID
      const dateString = form.date.replace(/-/g, "");
      setReference(`DINE-${dateString}-${recordId.slice(0, 4).toUpperCase()}`);
      notify("success", "Table request securely submitted.");
    } catch (error) {
      notify("error", error.message || "Failed to submit reservation.");
    } finally {
      setBusy(false);
    }
  };

  if (reference) {
    return (
      <Confirmation
        title="Table Request Received"
        reference={reference}
        copy="Your reservation request has been sent to our Maitre D'. We will review availability and send a final confirmation to your email shortly."
      />
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-5 py-16 md:py-24">
      <div className="text-center">
        <SectionTitle
          eyebrow="Dining Reservations"
          title="Secure Your Table"
          copy="Join us for an exceptional dining experience. Please note that reservations are subject to final confirmation by our restaurant team."
          align="center"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className={`${STYLES.card} mt-12 grid gap-6 p-8 md:grid-cols-2 md:p-10`}
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

        <Field label="Number of Guests">
          <input
            className={STYLES.input}
            required
            min="1"
            max="20"
            type="number"
            name="guests"
            value={form.guests}
            onChange={handleInputChange}
          />
        </Field>

        <Field label="Reservation Date">
          <input
            className={STYLES.input}
            required
            min={today}
            type="date"
            name="date"
            value={form.date}
            onChange={handleInputChange}
          />
        </Field>

        <Field label="Time">
          <input
            className={STYLES.input}
            required
            type="time"
            name="time"
            value={form.time}
            onChange={handleInputChange}
            step="900" 
          />
        </Field>

        <Field label="Seating Preference" className="md:col-span-2">
          <select
            className={STYLES.input}
            name="seating"
            value={form.seating}
            onChange={handleInputChange}
          >
            <option>No Preference</option>
            <option>Main Dining Room</option>
            <option>Outdoor Terrace</option>
            <option>Window Seating</option>
            <option>Bar Area</option>
          </select>
        </Field>

        <Field label="Special Requests or Dietary Restrictions" className="md:col-span-2">
          <textarea
            className={STYLES.input}
            maxLength="1000"
            rows="4"
            name="requests"
            value={form.requests}
            onChange={handleInputChange}
            placeholder="Please let us know if you are celebrating a special occasion or have any food allergies..."
          />
        </Field>

        <div className="md:col-span-2 md:mt-4">
          <Button variant="primary" className="w-full" disabled={busy}>
            {busy ? "Processing Request..." : "Request Reservation"}
          </Button>
        </div>
      </form>
    </section>
  );
}