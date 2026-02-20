import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Вхід",
  description: "Увійдіть до освітньої платформи OaEdu Острозької академії.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
