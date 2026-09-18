import { useEffect, useMemo, useState } from "react";
import { money, site } from "../config/site";
import { useFeedback } from "../components/Feedback";
import {
  createTrackableRecord,
  getRecords,
} from "../services/records";
import { calculateBookingTotal, calculateNights, generateSecureReference } from "../lib/booking";
import {
  Button,
  STYLES,
  Confirmation,
  Field,
  formatDate,
  SectionTitle,
  today,
} from "./shared";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => phone.trim().length >= 7;

const INITIAL_FORM_STATE = {
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
};

export function Booking() {
  const params = new URLSearchParams(window.location.search);
  const urlRoomId = params.get("room");

  const [dbRooms, setDbRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [form, setForm] = useState({ ...INITIAL_FORM_STATE, roomId: "" });
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState("");
  const { notify } = useFeedback();

  useEffect(() => {
    getRecords("rooms")
      .then((data) => {
        setDbRooms(data);
        if (data.length > 0) {
          const matchedRoom = data.find((r) => r.id === urlRoomId);
          setForm((prev) => ({ ...prev, roomId: matchedRoom ? matchedRoom.id : data[0].id }));
        }
      })
      .catch((error) => notify("error", "Failed to load available rooms."))
      .finally(() => setLoadingRooms(false));
  }, [urlRoomId, notify]);

  const activeRoom = useMemo(
    () => dbRooms.find((item) => item.id === form.roomId) || dbRooms[0] || {},
    [form.roomId, dbRooms]
  );

  const nights = useMemo(
    () => calculateNights(form.checkIn, form.checkOut),
    [form.checkIn, form.checkOut]
  );

  const totals = useMemo(() => calculateBookingTotal({
    roomPrice: activeRoom.price || 0,
    nights,
    adults: Number(form.adults),
    breakfastSelected: form.breakfast,
    airportTransferSelected: form.transfer,
    breakfastPerAdult: site.booking.breakfastPerAdult,
    airportTransferPrice: site.booking.airportTransfer,
  }), [activeRoom.price, nights, form.adults, form.breakfast, form.transfer]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.checkIn < today) {
      return notify("error", "Check-in date cannot be in the past.");
    }
    if (!nights || nights <= 0) {
      return notify("error", "Check-out date must be after check-in date.");
    }
    if (!isValidEmail(form.email)) {
      return notify("error", "Please provide a valid email address.");
    }
    if (!isValidPhone(form.phone)) {
      return notify("error", "Please provide a valid phone number.");
    }

    setBusy(true);

    try {
      const refCode = generateSecureReference("RES");

      await createTrackableRecord(
        "bookings",
        {
          ...form,
          room: {
            id: activeRoom.id,
            name: activeRoom.name,
            price: activeRoom.price,
          },
          nights,
          total: totals.total,
          status: "pending",
        },
        {
          reference: refCode,
          type: "booking",
          status: "pending",
          title: activeRoom.name || "Room Booking",
        }
      );

      setReference(refCode);
      notify("success", "Booking request processed successfully.");
    } catch (error) {
      notify("error", error.message || "An error occurred while processing your request.");
    } finally {
      setBusy(false);
    }
  };

  if (reference) {
    return (
      <Confirmation
        title="Reservation Request Received"
        reference={reference}
        copy="Your details have been securely transmitted to our reservations team. You will receive a confirmation email shortly once your stay is finalized."
      />
    );
  }

  if (loadingRooms) {
    return (
      <section className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-5 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent"></div>
      </section>
    );
  }

  if (dbRooms.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-24 text-center">
        <h2 className="text-2xl font-serif text-white">No Rooms Available</h2>
        <p className="mt-2 text-stone-400">The hotel has not listed any rooms yet. Please check back later.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <SectionTitle eyebrow="Secure Reservation" title="Guest Details" />
            <p className="mt-2 text-sm text-stone-400">Please provide your information to complete the booking process.</p>
          </div>

          <div className={`${STYLES.card} grid gap-6 p-8 md:grid-cols-2`}>
            <Field label="Selected Room" className="md:col-span-2">
              <select
                name="roomId"
                value={form.roomId}
                onChange={handleInputChange}
                className={STYLES.input}
              >
                {dbRooms.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name} — {money(item.price)} / night
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Check-in Date">
              <input
                className={STYLES.input}
                min={today}
                required
                name="checkIn"
                type="date"
                value={form.checkIn}
                onChange={handleInputChange}
              />
            </Field>

            <Field label="Check-out Date">
              <input
                className={STYLES.input}
                min={form.checkIn || today}
                required
                name="checkOut"
                type="date"
                value={form.checkOut}
                onChange={handleInputChange}
              />
            </Field>

            <Field label="Adults">
              <input
                className={STYLES.input}
                min="1"
                max="8"
                name="adults"
                type="number"
                value={form.adults}
                onChange={handleInputChange}
              />
            </Field>

            <Field label="Children">
              <input
                className={STYLES.input}
                min="0"
                max="8"
                name="children"
                type="number"
                value={form.children}
                onChange={handleInputChange}
              />
            </Field>

            <Field label="First Name">
              <input
                className={STYLES.input}
                required
                name="firstName"
                value={form.firstName}
                onChange={handleInputChange}
                placeholder="Jane"
              />
            </Field>

            <Field label="Last Name">
              <input
                className={STYLES.input}
                required
                name="lastName"
                value={form.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
              />
            </Field>

            <Field label="Email Address">
              <input
                className={STYLES.input}
                required
                name="email"
                type="email"
                value={form.email}
                onChange={handleInputChange}
                placeholder="jane.doe@example.com"
              />
            </Field>

            <Field label="Phone Number">
              <input
                className={STYLES.input}
                required
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
              />
            </Field>
          </div>

          <div className={`${STYLES.card} space-y-6 p-8`}>
            <h3 className="font-serif text-xl text-white">Enhance Your Stay</h3>

            <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-white/5 bg-stone-900/30 p-4 transition-colors hover:bg-stone-900/60">
              <input
                name="breakfast"
                checked={form.breakfast}
                onChange={handleInputChange}
                type="checkbox"
                className="mt-1 h-5 w-5 accent-amber-400"
              />
              <span className="flex flex-col">
                <span className="font-medium text-stone-200">Daily Breakfast</span>
                <span className="text-sm text-stone-400">
                  {money(site.booking.breakfastPerAdult)} per adult, per night
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-white/5 bg-stone-900/30 p-4 transition-colors hover:bg-stone-900/60">
              <input
                name="transfer"
                checked={form.transfer}
                onChange={handleInputChange}
                type="checkbox"
                className="mt-1 h-5 w-5 accent-amber-400"
              />
              <span className="flex flex-col">
                <span className="font-medium text-stone-200">Airport Transfer</span>
                <span className="text-sm text-stone-400">
                  {money(site.booking.airportTransfer)} one-way luxury car service
                </span>
              </span>
            </label>

            <Field label="Special Requests (Optional)">
              <textarea
                name="requests"
                maxLength="1000"
                rows="3"
                value={form.requests}
                onChange={handleInputChange}
                className={STYLES.input}
                placeholder="Allergies, arrival time, or special occasions..."
              />
            </Field>
          </div>

          <div className="flex justify-end">
            <Button variant="primary" disabled={busy} className="w-full md:w-auto md:px-12">
              {busy ? "Processing Request..." : "Confirm Reservation"}
            </Button>
          </div>
        </form>

        <aside className="relative">
          <div className={`${STYLES.card} sticky top-28 p-8`}>
            <h2 className="border-b border-white/10 pb-4 font-serif text-2xl text-white">Stay Summary</h2>

            <div className="mt-6 flex gap-4">
              <img
                src={activeRoom.image || "/api/placeholder/100/100"}
                alt={activeRoom.name || "Room"}
                className="h-20 w-24 rounded-lg object-cover shadow-md"
              />
              <div>
                <p className="font-medium text-white">{activeRoom.name}</p>
                <p className="mt-1 text-sm text-stone-400">{activeRoom.capacity || 2} Guests</p>
              </div>
            </div>

            <dl className="mt-8 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-stone-400">Check-in</dt>
                <dd className="font-medium text-stone-200">{formatDate(form.checkIn)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-400">Check-out</dt>
                <dd className="font-medium text-stone-200">{formatDate(form.checkOut)}</dd>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-4">
                <dt className="text-stone-400">Duration</dt>
                <dd className="font-medium text-stone-200">{nights ? `${nights} Night${nights > 1 ? 's' : ''}` : "—"}</dd>
              </div>

              <div className="flex justify-between pt-2">
                <dt className="text-stone-400">Room Total</dt>
                <dd className="font-medium text-stone-200">{money(totals.roomTotal)}</dd>
              </div>

              {form.breakfast && (
                <div className="flex justify-between text-stone-400">
                  <dt>Breakfast</dt>
                  <dd>{money(totals.breakfastTotal)}</dd>
                </div>
              )}

              {form.transfer && (
                <div className="flex justify-between text-stone-400">
                  <dt>Transfer</dt>
                  <dd>{money(totals.transferTotal)}</dd>
                </div>
              )}

              <div className="mt-6 flex justify-between border-t border-white/10 pt-6 text-lg font-bold">
                <dt className="text-white">Total Estimate</dt>
                <dd className="text-amber-400">{money(totals.total)}</dd>
              </div>
            </dl>

            <div className="mt-8 rounded-xl bg-stone-900/50 p-4 text-xs leading-relaxed text-stone-400">
              Payment is securely processed upon arrival. No charges will be made to your account today.
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}