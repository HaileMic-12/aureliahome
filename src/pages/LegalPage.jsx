import { policies, site } from "../config/site";
import { SectionTitle, STYLES } from "./shared";

export function Legal({ kind }) {
  const isPrivacy = kind === "privacy";
  const title = isPrivacy ? "Privacy Policy" : "Terms & Conditions";
  const text = isPrivacy ? policies.privacy : policies.terms;
  
  return (
    <section className="mx-auto max-w-4xl px-5 py-24">
      <SectionTitle
        eyebrow="Legal Information"
        title={title}
        copy={`Last updated: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
      />
      
      <article className={`${STYLES.card} mt-12 p-8 leading-loose text-stone-300 md:p-12`}>
        <div className="prose prose-invert max-w-none prose-headings:font-serif prose-a:text-amber-400 hover:prose-a:text-amber-300">
          <p className="whitespace-pre-wrap">{text}</p>
          
          <h2 className="mt-10 font-serif text-2xl text-white">Contacting Us</h2>
          <p className="mt-4">
            If you have any questions regarding this {title.toLowerCase()} or our data practices, please contact our compliance team directly at <a href={`mailto:${site.email}`} className="font-medium text-amber-400">{site.email}</a>.
          </p>
          
          {isPrivacy && (
            <>
              <h2 className="mt-10 font-serif text-2xl text-white">Data Security</h2>
              <p className="mt-4">
                We implement industry-standard security measures, including encrypted transmission and secure cloud storage, to protect your personal and payment information during the reservation process.
              </p>
            </>
          )}
        </div>
      </article>
    </section>
  );
}