"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { decodeShareLink } from "@/lib/share-link";
import { ResultsView } from "@/components/results-view";

function ShareContent() {
  const params = useSearchParams();
  const dataParam = params.get("data");

  if (!dataParam) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Invalid Share Link</h1>
        <p className="text-gray-500 mt-2">This link doesn&apos;t contain valid data.</p>
        <a href="/" className="text-gray-900 hover:underline mt-4 inline-block">Go to BrandScout →</a>
      </div>
    );
  }

  const data = decodeShareLink(dataParam);

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Invalid Share Link</h1>
        <p className="text-gray-500 mt-2">Could not decode the shared data.</p>
        <a href="/" className="text-gray-900 hover:underline mt-4 inline-block">Go to BrandScout →</a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-center">
        <p className="text-sm text-gray-500">📋 Shared results — read-only view</p>
      </div>
      <div className="flex justify-center">
        <ResultsView data={data} />
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-16 text-center">Loading...</div>}>
      <ShareContent />
    </Suspense>
  );
}
