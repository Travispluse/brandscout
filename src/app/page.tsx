import { HomeSearch } from "@/components/home-search";
import { SeoContent, HomeJsonLd } from "@/components/seo-content";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <HomeJsonLd />
      {/* Server-rendered hero content visible to crawlers */}
      <div className="flex flex-col items-center px-4">
        <div className="flex flex-col items-center pt-32">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-3">
              Is your brand name available?
            </h1>
            <p className="text-gray-500 text-lg max-w-md">
              Check domain and social media availability instantly. Free, no signup required.
            </p>
          </div>
        </div>
      </div>
      <HomeSearch />
      {/* Static SEO content rendered server-side for crawlers */}
      <SeoContent />
    </div>
  );
}
