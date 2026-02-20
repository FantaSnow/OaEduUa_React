import React from "react";
import type { Metadata } from "next";
import NewsLayout from "@/components/layouts/NewsLayout";

export const metadata: Metadata = {
  title: "Новини",
  description:
    "Актуальні новини Національного університету «Острозька академія»: події, наука, культура, спорт.",
};

export default function NewsSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NewsLayout>{children}</NewsLayout>;
}

