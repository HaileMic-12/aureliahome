import React, { useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Button, Field, STYLES, SectionTitle } from "./shared";

const STATUS_MESSAGES = {
  new: {
    label: "Received",
    text: "We have received your request and are reviewing it.",
    color: "text-blue-400",
  },
  pending: {
    label: "Reviewing",
    text: "Our staff is currently reviewing your request.",
    color: "text-amber-400",
  },
  confirmed: {
    label: "Confirmed",
    text: "Your request has been approved and confirmed.",
    color: "text-emerald-400",
  },
  preparing: {
    label: "Preparing",
    text: "Your order is currently being prepared.",
    color: "text-amber-400",
  },
  ready: {
    label: "Ready",
    text: "Your order is ready.",
    color: "text-emerald-400",
  },
  completed: {
    label: "Completed",
    text: "Your request has been completed.",
    color: "text-stone-400",
  },
  handled: {
    label: "Handled",
    text: "Your request has been taken care of.",
    color: "text-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    text: "This request has been cancelled.",
    color: "text-red-400",
  },
};

export function Track() {
  const [reference, setReference] = useState("");
  const [type, setType] = useState("all");
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trackRecord = (e) => {
    e.preventDefault();

    const searchTerm = reference.trim().toUpperCase();

    if (!searchTerm) {
      setError("Please enter your reference code.");
      return;
    }

    if (!db) {
      setError("Tracking is currently unavailable. Please try again later.");
      return;
    }

    setLoading(true);
    setError("");
    setRecord(null);

    const trackingRef = doc(db, "publicTracking", searchTerm);

    const unsubscribe = onSnapshot(
      trackingRef,
      (snapshot) => {
        setLoading(false);

        if (!snapshot.exists()) {
          setRecord(null);
          setError(
            "No request was found with that reference code. Please check the code and try again.",
          );
          return;
        }

        const data = snapshot.data();

        if (type !== "all" && data.type !== type) {
          setRecord(null);
          setError(
            "That reference belongs to a different request type. Please select the correct type.",
          );
          return;
        }

        setRecord({
          id: snapshot.id,
          ...data,
        });
      },
      () => {
        setLoading(false);
        setRecord(null);
        setError(
          "We couldn't load the tracking information. Please check your reference code and try again.",
        );
      },
    );

    // Stop listening when the user performs another search/unmounts.
    return unsubscribe;
  };

  const status = STATUS_MESSAGES[record?.status] || {
    label: "Processing",
    text: "Your request is currently being processed.",
    color: "text-white",
  };

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 py-24">
      <div className="mb-10 w-full text-center">
        <SectionTitle
          eyebrow="Real-Time Updates"
          title="Track Your Request"
        />

        <p className="mt-4 text-stone-400">
          Enter your reference code below to see the latest status of your
          booking or order.
        </p>
      </div>

      <div className={`${STYLES.card} w-full p-8`}>
        <form onSubmit={trackRecord} className="space-y-6">
          <Field label="What are you tracking?">
            <select
              className={STYLES.input}
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setError("");
              }}
            >
              <option value="all">Any Request</option>
              <option value="booking">Room Booking</option>
              <option value="order">Food Order</option>
              <option value="roomService">Room Service</option>
            </select>
          </Field>

          <Field label="Reference Code">
            <input
              required
              className={STYLES.input}
              value={reference}
              onChange={(e) => {
                setReference(e.target.value.toUpperCase());
                setError("");
              }}
              placeholder="Example: RES-123456-ABCD"
            />
          </Field>

          <Button
            variant="primary"
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Searching..." : "Track Status"}
          </Button>
        </form>

        {error && (
          <div className="mt-6 rounded border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {record && (
          <div className="mt-8 animate-in border-t border-white/10 pt-8 fade-in slide-in-from-bottom-4">
            <div className="mb-6 text-center">
              <p className="text-xs uppercase tracking-widest text-stone-500">
                Reference
              </p>

              <p className="mt-2 font-mono text-sm font-semibold text-amber-400">
                {record.reference}
              </p>

              <h3 className="mt-4 font-serif text-xl text-white">
                {record.title || "Hotel Request"}
              </h3>
            </div>

            <div className="rounded-xl border border-white/5 bg-stone-900/50 p-6 text-center">
              <p className="mb-2 text-xs uppercase tracking-widest text-stone-500">
                Current Status
              </p>

              <h4 className={`text-2xl font-bold ${status.color}`}>
                {status.label}
              </h4>

              <p className="mt-3 text-sm text-stone-300">
                {status.text}
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="flex items-center justify-center gap-2 text-xs text-stone-500">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                </span>
                Live updating
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}