import { HomeSearch } from "@/components/home-search";
import { SeoContent, HomeJsonLd } from "@/components/seo-content";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <HomeJsonLd />
      <HomeSearch />
      {/* Static SEO content rendered server-side for crawlers */}
      <SeoContent />
    </div>
  );
}
