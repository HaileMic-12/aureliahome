import { useState } from "react";
import { site } from "../config/site";
import { SectionTitle } from "../components/Layout";
import { useFeedback } from "../components/Feedback";
import { createRecord } from "../services/records";
import { Button, STYLES, Field } from "./shared";

const INITIAL_FORM_STATE = {
  name: "",
  email: "",
  phone: "",
  subject: "General inquiry",
  message: "",
};

export function Contact() {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [busy, setBusy] = useState(false);
  const { notify } = useFeedback();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.message.trim().length < 10) {
      return notify("error", "Please provide a bit more detail in your message (at least 10 characters).");
    }

    setBusy(true);
    try {
      await createRecord("messages", { ...form, status: "new" });
      notify("success", "Your message has been securely sent. Our concierge team will reply shortly.");
      setForm(INITIAL_FORM_STATE);
    } catch (error) {
      notify("error", error.message || "Failed to send message.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
        <div>
          <SectionTitle
            eyebrow="Contact & Location"
            title="We would love to hear from you"
            copy="Whether you are planning a stay, organizing an event, or simply have a question, our team is here to assist you."
          />
          
          <address className="mt-12 not-italic">
            <div className={`${STYLES.card} p-8`}>
              <h3 className="mb-4 font-serif text-xl text-white">Property Address</h3>
              <div className="space-y-1 text-stone-300">
                {site.address.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              
              <div className="mt-8 space-y-4 border-t border-white/10 pt-8">
                <div>
                  <p className="text-xs uppercase tracking-widest text-stone-500">Reservations & Desk</p>
                  <a className="mt-1 block text-lg font-medium text-amber-400 transition-colors hover:text-amber-300" href={`tel:${site.phone}`}>
                    {site.phone}
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-stone-500">Email Enquiries</p>
                  <a className="mt-1 block text-lg font-medium text-amber-400 transition-colors hover:text-amber-300" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </div>
              </div>
            </div>
          </address>
          
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <iframe
              className="h-72 w-full border-0 bg-stone-900"
              title="Property location"
              src={site.mapEmbedUrl}
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`${STYLES.card} h-fit p-8 md:p-12`}
        >
          <h2 className="font-serif text-3xl text-white">Send a Message</h2>
          <p className="mt-3 text-sm text-stone-400">Complete the form below and we will get back to you within 24 hours.</p>
          
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Field label="Full Name" className="md:col-span-2">
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
            
            <Field label="Subject" className="md:col-span-2">
              <select
                className={STYLES.input}
                name="subject"
                value={form.subject}
                onChange={handleInputChange}
              >
                <option value="General inquiry">General inquiry</option>
                <option value="Reservation">Reservation</option>
                <option value="Event inquiry">Event inquiry</option>
                <option value="Accessibility">Accessibility</option>
              </select>
            </Field>
            
            <Field label="Message" className="md:col-span-2">
              <textarea
                className={STYLES.input}
                required
                rows="6"
                maxLength="2000"
                name="message"
                value={form.message}
                onChange={handleInputChange}
                placeholder="How can we help you?"
              />
            </Field>
            
            <div className="md:col-span-2 md:mt-4">
              <Button variant="primary" className="w-full" disabled={busy}>
                {busy ? "Sending Message..." : "Send Message"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}