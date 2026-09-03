import { useState } from "react";
import { money, roomServiceMenu, site } from "../config/site";
import { useFeedback } from "../components/Feedback";
import { createRecord } from "../services/records";
import {
  Button,
  card,
  Confirmation,
  Field,
  input,
  SectionTitle,
} from "./shared";

export function RoomService() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    name: "",
    roomNumber: "",
    phone: "",
    deliveryTime: "as-soon-as-possible",
    paymentMethod: "charge-to-room",
    instructions: "",
  });
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState("");
  const { notify } = useFeedback();
  const add = (item) =>
    setCart((current) => {
      const found = current.find((entry) => entry.id === item.id);
      return found
        ? current.map((entry) =>
            entry.id === item.id
              ? { ...entry, quantity: entry.quantity + 1 }
              : entry,
          )
        : [...current, { ...item, quantity: 1 }];
    });
  const adjust = (id, delta) =>
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const fee = subtotal * site.booking.serviceFeeRate;
  const total = subtotal + fee;
  const submit = async (e) => {
    e.preventDefault();
    if (!cart.length) {
      notify("error", "Add at least one item to your order.");
      return;
    }
    if (form.roomNumber.trim().length < 1 || form.name.trim().length < 2) {
      notify("error", "Enter your name and room number.");
      return;
    }
    setBusy(true);
    try {
      const id = await createRecord("roomServiceOrders", {
        ...form,
        items: cart,
        subtotal,
        serviceFee: fee,
        total,
        status: "pending",
      });
      setReference(`ORDER-${id.slice(0, 8).toUpperCase()}`);
      notify("success", "Room-service order received.");
      setCart([]);
    } catch (error) {
      notify("error", error.message);
    } finally {
      setBusy(false);
    }
  };
  if (reference)
    return (
      <Confirmation
        title="Order received"
        reference={reference}
        copy="Your order was saved for the hotel team. It is not accepted until its status is updated."
      />
    );
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_.8fr]">
        <div>
          <SectionTitle
            eyebrow="Room service"
            title="Good food, delivered"
            copy="Room-service orders are sent to the property dashboard once Firebase is configured."
          />
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {roomServiceMenu.map((item) => (
              <article className={`${card} overflow-hidden`} key={item.id}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <div className="flex justify-between">
                    <h2 className="font-serif text-xl">{item.name}</h2>
                    <strong className="text-amber-200">
                      {money(item.price)}
                    </strong>
                  </div>
                  <p className="mt-2 text-sm text-stone-400">
                    {item.description}
                  </p>
                  <button
                    onClick={() => add(item)}
                    className="mt-5 text-sm font-bold text-amber-200 hover:text-amber-100"
                  >
                    Add to order +
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
        <aside className={`${card} h-fit p-6 lg:sticky lg:top-28`}>
          <h2 className="font-serif text-2xl">Your order</h2>
          {cart.length ? (
            <div className="mt-5 space-y-4">
              {cart.map((item) => (
                <div
                  className="flex items-center justify-between gap-3"
                  key={item.id}
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-stone-400">
                      {money(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      aria-label={`Remove one ${item.name}`}
                      onClick={() => adjust(item.id, -1)}
                      className="rounded bg-white/10 px-2"
                    >
                      −
                    </button>
                    <button
                      aria-label={`Add one ${item.name}`}
                      onClick={() => adjust(item.id, 1)}
                      className="rounded bg-white/10 px-2"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-stone-500">Your order is empty.</p>
          )}
          <form
            onSubmit={submit}
            className="mt-7 space-y-4 border-t border-white/10 pt-6"
          >
            <Field label="Guest name">
              <input
                required
                className={input}
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
            <Field label="Room number">
              <input
                required
                className={input}
                name="roomNumber"
                value={form.roomNumber}
                onChange={(e) =>
                  setForm({ ...form, roomNumber: e.target.value })
                }
              />
            </Field>
            <Field label="Delivery">
              <select
                className={input}
                value={form.deliveryTime}
                onChange={(e) =>
                  setForm({ ...form, deliveryTime: e.target.value })
                }
              >
                <option value="as-soon-as-possible">As soon as possible</option>
                <option value="30-minutes">In 30 minutes</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </Field>
            <div className="space-y-2 border-y border-white/10 py-4 text-sm">
              <p className="flex justify-between">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </p>
              <p className="flex justify-between">
                <span>Service fee</span>
                <span>{money(fee)}</span>
              </p>
              <p className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-amber-200">{money(total)}</span>
              </p>
            </div>
            <Button className="w-full" disabled={busy}>
              {busy ? "Sending order…" : "Send room-service order"}
            </Button>
          </form>
        </aside>
      </div>
    </section>
  );
}
