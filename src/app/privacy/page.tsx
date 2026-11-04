import { Breadcrumbs } from "@/components/breadcrumbs";
import { CookieSettingsLink } from "@/components/cookie-consent";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "BrandScout Privacy Policy — what we collect, which third parties receive data, and your choices, including California privacy rights.",
  path: "/privacy",
});

// Keep this page in step with src/components/cookie-consent.tsx and src/app/layout.tsx.
export default function PrivacyPage() {
  const h2 = "text-xl font-semibold mt-8 mb-4";
  const p = "text-gray-600 leading-relaxed";
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-neutral">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <h1 className="text-3xl font-bold tracking-tight mb-8">Privacy Policy</h1>
      <p className="text-gray-600 text-sm mb-8">Effective date: November 4, 2026</p>

      <p className={p}>
        This policy explains what information BrandScout (brandscout.net) collects when you use the site, who
        receives it, and the choices you have.
      </p>

      <h2 className={h2}>1. Information we collect</h2>
      <ul className="text-gray-600 space-y-2">
        <li>
          <strong>Names you search.</strong> When you run a search, the name or domain you enter is sent to our
          server, which checks availability and may store the search and its results in our database to run and
          improve the Service. Please do not enter personal information in the search box.
        </li>
        <li>
          <strong>Technical data.</strong> Like any website, our hosting provider receives your IP address, browser
          type and the pages you request. We use IP addresses briefly to rate-limit the public API.
        </li>
        <li>
          <strong>Analytics (only if you allow it).</strong> If you tap &ldquo;Allow&rdquo; on the cookie banner, we
          load Google Analytics, Microsoft Clarity and Ahrefs Web Analytics. These services set cookies or similar
          identifiers and receive information about your visit, such as pages viewed, clicks, scrolling, device and
          browser details, approximate location derived from IP address, and referring site. Microsoft Clarity also
          records how you interact with pages (mouse movement, clicks, scrolling and on-page text) so we can replay
          sessions and build heatmaps.
        </li>
        <li>
          <strong>Data kept in your browser.</strong> Recent searches (only if you allow cookies), saved names,
          dashboard settings, newsletter sign-ups and preferences are stored in your browser&apos;s local storage and
          are not sent to our server. You can view, export or delete them on the{" "}
          <a href="/privacy-settings" className="underline">Privacy Settings</a> page.
        </li>
      </ul>

      <h2 className={h2}>2. How we use information</h2>
      <ul className="text-gray-600 space-y-2">
        <li>To provide availability checks, scores and suggestions</li>
        <li>To understand how the site is used and improve it (analytics, only with your permission)</li>
        <li>To detect and prevent abuse, such as excessive automated requests</li>
      </ul>

      <h2 className={h2}>3. Third parties that receive data</h2>
      <p className={p}>We do not sell your personal information. These third parties receive data when you use BrandScout:</p>
      <ul className="text-gray-600 space-y-2 mt-2">
        <li>
          <strong>Google Analytics</strong> (Google LLC) — usage analytics, loaded only after you tap &ldquo;Allow&rdquo;.
          Advertising features and Google signals are turned off.
        </li>
        <li>
          <strong>Microsoft Clarity</strong> (Microsoft Corporation) — session recording and heatmaps, loaded only after you
          tap &ldquo;Allow&rdquo;.
        </li>
        <li>
          <strong>Ahrefs Web Analytics</strong> (Ahrefs Pte. Ltd.) — usage analytics, loaded only after you tap
          &ldquo;Allow&rdquo;.
        </li>
        <li>
          <strong>Vercel</strong> (Vercel Inc.) — hosts the site and receives standard request data such as IP address.
        </li>
        <li>
          <strong>Availability sources</strong> — to check a name, our server (not your browser) sends the name you
          searched to RDAP.org and domain registries, and requests public profile pages on platforms such as GitHub,
          Reddit, Instagram, X, TikTok, YouTube and others. Your IP address is not sent to them by these checks.
        </li>
        <li>
          <strong>Sites you choose to open</strong> — links to registrars (for example Namecheap, GoDaddy, Porkbun),
          the USPTO and social networks take you to those sites, which have their own privacy policies.
        </li>
      </ul>

      <h2 className={h2}>4. Cookies and your choices</h2>
      <p className={p}>
        Analytics cookies stay off unless you allow them. If you tap &ldquo;Decline&rdquo;, or your browser sends a{" "}
        <strong>Global Privacy Control</strong> (GPC) signal, we do not load Google Analytics, Microsoft Clarity or Ahrefs,
        and the site keeps working normally. You can change your choice at any time:{" "}
        <CookieSettingsLink />. A change takes full effect on your next page load.
      </p>

      <h2 className={h2}>5. Data retention</h2>
      <p className={p}>
        Data in your browser stays until you delete it (Privacy Settings page or your browser settings). Server-side
        search records are kept only as long as needed to run and improve the Service; contact us to ask for deletion.
        Analytics providers keep data under their own retention settings.
      </p>

      <h2 className={h2}>6. Your California privacy rights</h2>
      <p className={p}>
        If you are a California resident, the California Consumer Privacy Act (as amended by the CPRA) gives you the right
        to know what personal information we collect, use and disclose; to request deletion or correction; to opt out of
        the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal information for cross-context behavioral advertising;
        to limit use of sensitive personal information; and not to be discriminated against for exercising these rights.
        We do not sell personal information or use it for cross-context behavioral advertising. To opt out of analytics,
        tap &ldquo;Decline&rdquo; or turn on Global Privacy Control in your browser. To make a request, email{" "}
        <a href="mailto:support@brandscout.net" className="underline">support@brandscout.net</a>. We may need to verify
        your request, and you may use an authorized agent.
      </p>

      <h2 className={h2}>7. Children</h2>
      <p className={p}>
        BrandScout is intended for adults and businesses. It is not directed to children under 13, and we do not knowingly
        collect personal information from children.
      </p>

      <h2 className={h2}>8. Changes to this policy</h2>
      <p className={p}>
        We may update this policy. The effective date above shows when it last changed.
      </p>

      <h2 className={h2}>9. Contact</h2>
      <p className={p}>
        Privacy questions or requests:{" "}
        <a href="mailto:support@brandscout.net" className="underline">support@brandscout.net</a>.
      </p>
    </div>
  );
}
