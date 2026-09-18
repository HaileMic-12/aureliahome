import { useState, useMemo } from "react";
import { money, roomServiceMenu, site } from "../config/site";
import { useFeedback } from "../components/Feedback";
import { createTrackableRecord } from "../services/records";
import { generateSecureReference } from "../lib/booking";
import {
  Button,
  STYLES,
  Confirmation,
  Field,
  SectionTitle,
} from "./shared";

const INITIAL_FORM_STATE = {
  name: "",
  email: "", // Added email field for tracking and notifications
  roomNumber: "",
  phone: "",
  deliveryTime: "as-soon-as-possible",
  paymentMethod: "charge-to-room",
  instructions: "",
};

export function RoomService() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState("");
  const { notify } = useFeedback();

  const handleAdd = (item) =>
    setCart((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      return existing
        ? current.map((entry) =>
            entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry
          )
        : [...current, { ...item, quantity: 1 }];
    });

  const handleAdjust = (id, delta) =>
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const fee = subtotal * (site.booking.serviceFeeRate || 0.15);
  const total = subtotal + fee;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      return notify("error", "Please add at least one item to your order.");
    }
    if (form.roomNumber.trim().length < 1 || form.name.trim().length < 2) {
      return notify("error", "Please provide a valid guest name and room number.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return notify("error", "Please provide a valid email address.");
    }

    setBusy(true);
    try {
      const refCode = generateSecureReference("RS");

      await createTrackableRecord(
        "roomServiceOrders",
        {
          ...form,
          items: cart,
          subtotal,
          serviceFee: fee,
          total,
          status: "pending",
        },
        {
          reference: refCode,
          type: "roomService",
          status: "pending",
          title: "Room Service Order",
        }
      );

      setReference(refCode);
      notify("success", "Room service order securely placed.");
      setCart([]);
    } catch (error) {
      console.error("Room Service Error:", error);
      notify("error", error.message || "Failed to process your order.");
    } finally {
      setBusy(false);
    }
  };

  if (reference) {
    return (
      <Confirmation
        title="Order Confirmed"
        reference={reference}
        copy="Your room service order has been received by our kitchen. It will be delivered to your room shortly. Check your email for status updates."
      />
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <SectionTitle
            eyebrow="In-Room Dining"
            title="Good food, delivered"
            copy="Enjoy our curated seasonal menu from the comfort of your suite. Prepared fresh and delivered promptly to your door."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {roomServiceMenu.map((item) => (
              <article className={`${STYLES.card} group flex flex-col overflow-hidden`} key={item.id}>
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-serif text-xl text-white">{item.name}</h2>
                    <strong className="text-lg font-medium text-amber-400">
                      {money(item.price)}
                    </strong>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-400">
                    {item.description}
                  </p>
                  <button
                    onClick={() => handleAdd(item)}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-amber-400/50 bg-amber-400/10 py-2.5 text-sm font-semibold text-amber-400 transition-colors hover:bg-amber-400 hover:text-stone-950"
                  >
                    Add to Order +
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="relative">
          <div className={`${STYLES.card} sticky top-28 p-8`}>
            <h2 className="border-b border-white/10 pb-4 font-serif text-2xl text-white">Your Order</h2>

            {cart.length > 0 ? (
              <div className="mt-6 space-y-5">
                {cart.map((item) => (
                  <div className="flex items-center justify-between gap-4" key={item.id}>
                    <div className="flex-1">
                      <p className="font-medium text-stone-200">{item.name}</p>
                      <p className="text-sm text-stone-400">
                        {money(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-stone-900/50 p-1">
                      <button
                        aria-label={`Remove one ${item.name}`}
                        onClick={() => handleAdjust(item.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded text-stone-400 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        −
                      </button>
                      <span className="w-4 text-center text-sm font-medium text-white">{item.quantity}</span>
                      <button
                        aria-label={`Add one ${item.name}`}
                        onClick={() => handleAdjust(item.id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded text-stone-400 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-white/20 bg-white/5 p-8 text-center">
                <p className="text-sm text-stone-400">Your cart is currently empty.</p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5 border-t border-white/10 pt-8"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Guest Name">
                  <input
                    required
                    className={STYLES.input}
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                  />
                </Field>
                <Field label="Email Address">
                  <input
                    required
                    type="email"
                    className={STYLES.input}
                    name="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@example.com"
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Suite / Room Number">
                  <input
                    required
                    className={STYLES.input}
                    name="roomNumber"
                    value={form.roomNumber}
                    onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                    placeholder="e.g. 412"
                  />
                </Field>
                <Field label="Phone Number">
                  <input
                    required
                    type="tel"
                    className={STYLES.input}
                    name="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Room phone or mobile"
                  />
                </Field>
              </div>

              <Field label="Delivery Timing">
                <select
                  className={STYLES.input}
                  value={form.deliveryTime}
                  onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
                >
                  <option value="as-soon-as-possible">As soon as possible (approx. 30-45 mins)</option>
                  <option value="60-minutes">In 60 minutes</option>
                  <option value="scheduled">Scheduled for later</option>
                </select>
              </Field>

              <div className="space-y-3 border-y border-white/10 py-5 text-sm">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Service Fee (15%)</span>
                  <span>{money(fee)}</span>
                </div>
                <div className="flex justify-between pt-2 text-lg font-bold">
                  <span className="text-white">Total Estimate</span>
                  <span className="text-amber-400">{money(total)}</span>
                </div>
              </div>

              <Button variant="primary" className="w-full" disabled={busy || cart.length === 0}>
                {busy ? "Processing Order..." : "Place Room Service Order"}
              </Button>
            </form>
          </div>
        </aside>
      </div>
    </section>
  );
}