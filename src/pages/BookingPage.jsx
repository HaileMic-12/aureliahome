import { useMemo, useState } from "react";
import { money, rooms, site } from "../config/site";
import { useFeedback } from "../components/Feedback";
import { createRecord } from "../services/records";
import {
  calculateBookingTotal,
  calculateNights,
  makeReference,
} from "../lib/booking";
import {
  Button,
  card,
  Confirmation,
  Field,
  formatDate,
  input,
  SectionTitle,
  today,
} from "./shared";

export function Booking() {
  const params = new URLSearchParams(window.location.search);
  const initial =
    rooms.find((room) => room.id === params.get("room"))?.id || rooms[0].id;
  const [form, setForm] = useState({
    roomId: initial,
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    requests: "",
    breakfast: false,
    transfer: false,
    paymentMethod: "pay-at-property",
  });
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState("");
  const { notify } = useFeedback();
  const room = rooms.find((item) => item.id === form.roomId);
  const nights = useMemo(
    () => calculateNights(form.checkIn, form.checkOut),
    [form.checkIn, form.checkOut],
  );
  const totals = calculateBookingTotal({
    roomPrice: room.price,
    nights,
    adults: Number(form.adults),
    breakfastSelected: form.breakfast,
    airportTransferSelected: form.transfer,
    breakfastPerAdult: site.booking.breakfastPerAdult,
    airportTransferPrice: site.booking.airportTransfer,
  });
  const change = (e) =>
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  const submit = async (e) => {
    e.preventDefault();
    if (!nights) {
      notify("error", "Choose a check-out date after check-in.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email) || form.phone.trim().length < 7) {
      notify("error", "Enter a valid email and phone number.");
      return;
    }
    setBusy(true);
    try {
      const id = await createRecord("bookings", {
        ...form,
        room: { id: room.id, name: room.name, price: room.price },
        nights,
        total: totals.total,
        status: "pending",
      });
      setReference(makeReference("STAY", id));
      notify("success", "Your booking request was received.");
    } catch (error) {
      notify("error", error.message);
    } finally {
      setBusy(false);
    }
  };
  if (reference)
    return (
      <Confirmation
        title="Booking request received"
        reference={reference}
        copy="Your request has been saved for the property team. A reservation is not confirmed until the hotel updates its status."
      />
    );
  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <div className="grid gap-10 lg:grid-cols-[1.5fr_.8fr]">
        <form onSubmit={submit} className="space-y-7">
          <SectionTitle eyebrow="Book a stay" title="Your travel details" />
          <div className={`${card} grid gap-5 p-6 md:grid-cols-2`}>
            <Field label="Room">
              <select
                name="roomId"
                value={form.roomId}
                onChange={change}
                className={input}
              >
                {rooms.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name} · {money(item.price)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Adults">
              <input
                className={input}
                min="1"
                max="8"
                name="adults"
                type="number"
                value={form.adults}
                onChange={change}
              />
            </Field>
            <Field label="Check-in">
              <input
                className={input}
                min={today}
                required
                name="checkIn"
                type="date"
                value={form.checkIn}
                onChange={change}
              />
            </Field>
            <Field label="Check-out">
              <input
                className={input}
                min={form.checkIn || today}
                required
                name="checkOut"
                type="date"
                value={form.checkOut}
                onChange={change}
              />
            </Field>
            <Field label="First name">
              <input
                className={input}
                required
                name="firstName"
                value={form.firstName}
                onChange={change}
              />
            </Field>
            <Field label="Last name">
              <input
                className={input}
                required
                name="lastName"
                value={form.lastName}
                onChange={change}
              />
            </Field>
            <Field label="Email">
              <input
                className={input}
                required
                name="email"
                type="email"
                value={form.email}
                onChange={change}
              />
            </Field>
            <Field label="Phone">
              <input
                className={input}
                required
                name="phone"
                type="tel"
                value={form.phone}
                onChange={change}
              />
            </Field>
            <Field label="Children">
              <input
                className={input}
                min="0"
                max="8"
                name="children"
                type="number"
                value={form.children}
                onChange={change}
              />
            </Field>
            <Field label="Payment">
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={change}
                className={input}
              >
                <option value="pay-at-property">Pay at property</option>
                <option value="payment-link">Request payment link</option>
              </select>
            </Field>
          </div>
          <div className={`${card} space-y-4 p-6`}>
            <label className="flex gap-3">
              <input
                name="breakfast"
                checked={form.breakfast}
                onChange={change}
                type="checkbox"
              />
              <span>
                Breakfast · {money(site.booking.breakfastPerAdult)} per adult,
                nightly
              </span>
            </label>
            <label className="flex gap-3">
              <input
                name="transfer"
                checked={form.transfer}
                onChange={change}
                type="checkbox"
              />
              <span>
                Airport transfer · {money(site.booking.airportTransfer)} one way
              </span>
            </label>
            <Field label="Special requests">
              <textarea
                name="requests"
                maxLength="1000"
                rows="4"
                value={form.requests}
                onChange={change}
                className={input}
              />
            </Field>
          </div>
          <Button disabled={busy}>
            {busy ? "Sending request…" : "Send booking request"}
          </Button>
        </form>
        <aside className={`${card} h-fit p-6 lg:sticky lg:top-28`}>
          <h2 className="font-serif text-2xl text-white">Stay summary</h2>
          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-stone-400">Room</dt>
              <dd>{room.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone-400">Dates</dt>
              <dd className="text-right">
                {formatDate(form.checkIn)}
                <br />
                {formatDate(form.checkOut)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-400">Nights</dt>
              <dd>{nights || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-400">Room total</dt>
              <dd>{money(totals.roomTotal)}</dd>
            </div>
            {form.breakfast && (
              <div className="flex justify-between">
                <dt className="text-stone-400">Breakfast</dt>
                <dd>{money(totals.breakfastTotal)}</dd>
              </div>
            )}
            {form.transfer && (
              <div className="flex justify-between">
                <dt className="text-stone-400">Transfer</dt>
                <dd>{money(totals.transferTotal)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-white/10 pt-4 text-lg font-bold">
              <dt>Total</dt>
              <dd className="text-amber-200">{money(totals.total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
