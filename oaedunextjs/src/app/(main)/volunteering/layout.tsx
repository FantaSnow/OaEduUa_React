import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Волонтерство",
  description:
    "Волонтерські можливості для студентів Острозької академії. Долучайтесь до добрих справ.",
};

export default function VolunteeringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
