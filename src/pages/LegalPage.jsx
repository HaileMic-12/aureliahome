import { policies, site } from "../config/site";
import { SectionTitle } from "../components/Layout";
import { card } from "./shared";

export function Legal({ kind }) {
  const title = kind === "privacy" ? "Privacy policy" : "Terms of use";
  const text = kind === "privacy" ? policies.privacy : policies.terms;
  const isPrivacy = kind === "privacy";
  return (
    <section className="mx-auto max-w-3xl px-5 py-20">
      <SectionTitle
        eyebrow="Demo legal copy"
        title={title}
        copy="This starter copy is not legal advice. Have qualified local counsel supply the policy that applies to your property."
      />
      <article className={`${card} mt-8 p-7 leading-8 text-stone-300`}>
        <p>{text}</p>
        <h2 className="mt-8 font-serif text-2xl text-white">
          Ethiopia legal starting point
        </h2>
        <p className="mt-3">
          This template is configured for a property operating in Ethiopia. {isPrivacy
            ? "Its privacy-policy starter references Ethiopia’s Personal Data Protection Proclamation No. 1321/2024. The property must confirm its lawful basis, notices, retention periods, data-subject process and any required registrations before launch."
            : "The property should have Ethiopian counsel confirm its governing-law wording, booking contract, cancellation, payment, refund and dispute-resolution terms before launch."}
        </p>
        <p className="mt-3">
          For privacy or booking-policy questions, publish a real contact point at {site.email} and replace all demo details in <code>src/config/site.js</code>.
        </p>
        <h2 className="mt-8 font-serif text-2xl text-white">
          Data submitted through the template
        </h2>
        <p className="mt-3">
          When Firebase is configured, form records are stored in the buyer’s
          Firestore project and are protected by the included rules. Without
          Firebase, forms show a configuration error and do not claim to save
          data.
        </p>
      </article>
    </section>
  );
}
