// src/pages/RestaurantPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { createTrackableRecord, getRecords } from "../services/records";
import { generateSecureReference } from "../lib/booking";
import { useFeedback } from "../components/Feedback";
import { assets, menu, money, site } from "../config/site";
import { Hero, STYLES, Button, Confirmation, Field } from "./shared";

export function Restaurant() {
  const { notify } = useFeedback();
  const [foods, setFoods] = useState(menu);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const [selectedFood, setSelectedFood] = useState(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [reference, setReference] = useState("");
  
  // Includes the email field needed for EmailJS tracking updates
  const [orderForm, setOrderForm] = useState({
    guestName: "",
    email: "",
    phone: "",
    orderType: "room",
    location: "",
    quantity: 1,
    specialInstructions: "",
  });

  useEffect(() => {
    getRecords("foods")
      .then((data) => {
        if (data && data.length > 0) {
          setFoods(data);
        }
      })
      .catch((error) => console.error("Failed to load dynamic menu", error))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = foods.map((item) => item.category || "General");
    return ["All", ...new Set(cats)];
  }, [foods]);

  const selectedMenu = useMemo(
    () =>
      activeCategory === "All"
        ? foods
        : foods.filter((item) => (item.category || "General") === activeCategory),
    [activeCategory, foods]
  );

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (!orderForm.guestName || !orderForm.phone || !orderForm.location || !orderForm.email) {
      return notify("error", "Please fill out your name, email, phone, and location.");
    }

    const safeQty = Math.max(1, parseInt(orderForm.quantity, 10) || 1);
    setIsOrdering(true);

    try {
      const refCode = generateSecureReference("ORD");

      await createTrackableRecord(
        "orders",
        {
          ...orderForm,
          quantity: safeQty,
          foodItem: selectedFood.name,
          pricePerItem: selectedFood.price,
          totalPrice: selectedFood.price * safeQty,
          status: "pending",
        },
        {
          reference: refCode,
          type: "order",
          status: "pending",
          title: selectedFood.name,
        }
      );

      setReference(refCode);
      setSelectedFood(null);
      notify("success", "Order successfully placed!");
    } catch (error) {
      console.error("Order Error: ", error);
      // This alert will reveal the exact database rejection reason if it fails again
      alert(`Firebase Error: ${error.message}`);
      notify("error", "Failed to place order. Check the alert for details.");
    } finally {
      setIsOrdering(false);
    }
  };

  if (reference) {
    return (
      <div className="py-32">
        <Confirmation
          title="Order Received!"
          reference={reference}
          copy={
            orderForm.orderType === "room"
              ? "Your food is being prepared and will be delivered to your room shortly. Check your email for status updates."
              : "Your order is being prepared. We will serve it to you shortly. Check your email for status updates."
          }
        />
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => {
              setReference("");
              setOrderForm({
                ...orderForm,
                quantity: 1,
                specialInstructions: "",
              });
            }}
          >
            Order Something Else
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero
        eyebrow="Dining Experiences"
        title={site.restaurant.name || "Culinary Excellence"}
        copy={
          site.restaurant.description ||
          "Locally sourced ingredients crafted into unforgettable seasonal dishes."
        }
        image={assets.restaurantHero}
      />

      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
          {categories.map((category) => (
            <button
              onClick={() => setActiveCategory(category)}
              key={category}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20"
                  : "border border-white/15 text-stone-300 hover:border-amber-400/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {selectedMenu.map((item) => (
            <article
              className={`${STYLES.card} group flex flex-col overflow-hidden`}
              key={item.id || item.name}
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-serif text-xl text-white">{item.name}</h2>
                  <strong className="whitespace-nowrap text-lg font-medium text-amber-400">
                    {money(item.price)}
                  </strong>
                </div>
                <p className="mt-3 mb-6 flex-1 text-sm leading-relaxed text-stone-400">
                  {item.description}
                </p>
                <Button
                  variant="primary"
                  className="mt-auto w-full"
                  onClick={() => setSelectedFood(item)}
                >
                  View Details & Order
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2">
          <div className={`${STYLES.card} p-8 lg:p-10`}>
            <h2 className="font-serif text-2xl text-white md:text-3xl">
              Hours of Operation
            </h2>
            <ul className="mt-6 space-y-3 text-stone-300">
              {site.restaurant.hours.map((line, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-amber-400"
                    aria-hidden="true"
                  />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`${STYLES.card} flex flex-col justify-center p-8 lg:p-10`}
          >
            <h2 className="font-serif text-2xl text-white md:text-3xl">
              In-Room Dining
            </h2>
            <p className="mt-4 leading-relaxed text-stone-400">
              Enjoy our culinary offerings from the comfort of your suite.
              Available exclusively for hotel guests.
            </p>
            <div className="mt-8">
              <Link to="/room-service">
                <Button variant="outline">View Room Service Menu</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {selectedFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm">
          <div
            className={`${STYLES.card} relative max-h-[90vh] w-full max-w-2xl overflow-y-auto p-8 shadow-2xl shadow-black`}
          >
            <button
              onClick={() => setSelectedFood(null)}
              className="absolute right-6 top-6 text-stone-400 transition-colors hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h2 className="mb-6 pr-8 font-serif text-2xl text-white">
              Complete Your Order
            </h2>

            <div className="mb-8 flex gap-5 rounded-xl border border-white/5 bg-stone-900/50 p-5">
              <img
                src={selectedFood.image}
                className="h-24 w-24 rounded-lg object-cover shadow-md"
                alt={selectedFood.name}
              />
              <div className="flex flex-col justify-center">
                <h4 className="mb-1 text-lg font-bold text-white">
                  {selectedFood.name}
                </h4>
                <p className="mb-2 font-medium text-amber-400">
                  {money(selectedFood.price)}
                </p>
                <p className="line-clamp-2 text-xs text-stone-400">
                  {selectedFood.description}
                </p>
              </div>
            </div>
            <form onSubmit={handleOrderSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Guest Name">
                  <input
                    required
                    className={STYLES.input}
                    value={orderForm.guestName}
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, guestName: e.target.value })
                    }
                    placeholder="Jane Doe"
                  />
                </Field>
                <Field label="Email Address">
                  <input
                    required
                    type="email"
                    className={STYLES.input}
                    value={orderForm.email}
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, email: e.target.value })
                    }
                    placeholder="jane@example.com"
                  />
                </Field>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Phone Number">
                  <input
                    required
                    type="tel"
                    className={STYLES.input}
                    value={orderForm.phone}
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, phone: e.target.value })
                    }
                    placeholder="Room phone or mobile"
                  />
                </Field>
                <Field label="Quantity">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className={STYLES.input}
                    value={orderForm.quantity}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        quantity: e.target.value,
                      })
                    }
                  />
                </Field>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Delivery Method">
                  <select
                    className={STYLES.input}
                    value={orderForm.orderType}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        orderType: e.target.value,
                        location: "",
                      })
                    }
                  >
                    <option value="room">Deliver to my Room</option>
                    <option value="spot">I am at a Table / Poolside</option>
                  </select>
                </Field>

                <Field
                  label={
                    orderForm.orderType === "room"
                      ? "Room Number"
                      : "Table / Location"
                  }
                >
                  <input
                    required
                    className={STYLES.input}
                    value={orderForm.location}
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, location: e.target.value })
                    }
                    placeholder={
                      orderForm.orderType === "room"
                        ? "e.g. 304"
                        : "e.g. Table 12"
                    }
                  />
                </Field>
              </div>
              <Field label="Special Instructions (Optional)">
                <textarea
                  className={STYLES.input}
                  rows="3"
                  value={orderForm.specialInstructions}
                  onChange={(e) =>
                    setOrderForm({
                      ...orderForm,
                      specialInstructions: e.target.value,
                    })
                  }
                  placeholder="Allergies, no onions, extra sauce..."
                />
              </Field>
              <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
                <div className="text-lg text-stone-300">
                  Total Due:{" "}
                  <span className="ml-2 text-2xl font-bold text-amber-400">
                    {money(
                      selectedFood.price *
                        Math.max(1, parseInt(orderForm.quantity, 10) || 1)
                    )}
                  </span>
                </div>
                <Button
                  variant="primary"
                  disabled={isOrdering}
                  className="w-full px-10 sm:w-auto"
                >
                  {isOrdering ? "Sending to Kitchen..." : "Place Order"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}