import { HomeSearch } from "@/components/home-search";
import { SeoContent, HomeJsonLd } from "@/components/seo-content";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white">
      <HomeJsonLd />
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <Image
          src="/brandscout-hero.svg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/84 to-gray-950/20" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:py-24">
          <p className="mb-4 text-sm font-medium text-cyan-200">BrandScout</p>
          <h1 className="max-w-3xl text-4xl font-semibold sm:text-6xl">
            Check the name before you build around it.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-gray-200 sm:text-lg">
            Search domains, social handles, and naming signals in one place before a good idea becomes an expensive rename.
          </p>
        </div>
      </section>
      <div className="relative z-10 -mt-8">
        <HomeSearch />
      </div>
      <SeoContent />
    </div>
  );
}
