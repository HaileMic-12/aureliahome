import emailjs from "@emailjs/browser";

// Your specific EmailJS keys
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_ljtf335";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_uivx7j9";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "ghRVM6FfnbkWPWTvC";

export async function sendStatusEmail({ to_name, to_email, reference, status, details }) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn("EmailJS keys missing. Skipping email.");
    return;
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      { to_name, to_email, reference, status: status.toUpperCase(), details },
      PUBLIC_KEY
    );
    console.log(`Email successfully sent to ${to_email}`);
  } catch (error) {
    console.error("EmailJS error:", error);
  }
}