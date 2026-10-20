import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Privacy Policy | CRUMACO",
  description: "How CRUMACO handles the details you share through this website.",
  // Stub until the final policy is supplied.
  robots: { index: false, follow: true },
};

// PLACEHOLDER: replace with the client's final, legally reviewed Privacy Policy.
export default function PrivacyPage() {
  return (
    <main className="theme-light min-h-svh">
      <header className="theme-dark">
        <div className="container-x flex h-16 items-center justify-between">
          <Link href="/" aria-label="CRUMACO home" className="-m-2 p-2">
            <Image src="/brand/logo_orange.png" alt="CRUMACO" width={97} height={32} className="h-8 w-auto" />
          </Link>
          <Link href="/" className="btn-text text-bone">Back to site</Link>
        </div>
      </header>
      <article className="container-x py-16 md:py-24">
        <p className="eyebrow eyebrow-dash">Placeholder</p>
        <h1 className="display text-h2 mt-6">
          Privacy <em>Policy</em>
        </h1>
        <div className="prose-body mt-10 space-y-5">
          <p className="border-l-2 border-orange pl-4 text-ink">
            This page is a placeholder. CRUMACO&rsquo;s final Privacy Policy will be published here before launch.
          </p>
          <p>
            The enquiry form on this site asks for your name, mobile number, an optional email address, what brings
            you in and when you would like to start. It does not ask for medical history.
          </p>
          <p>
            These details are used to reply to your enquiry on WhatsApp or by phone. How long they are kept, and how
            to have them corrected or deleted, will be set out in the final policy.
          </p>
        </div>
      </article>
    </main>
  );
}
