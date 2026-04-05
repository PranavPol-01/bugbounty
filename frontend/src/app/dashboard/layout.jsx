import DashboardLayout from "@/components/layout/DashboardLayout";

export const metadata = {
  title: "Dashboard — DecentraBounty",
};

export default function DashboardRootLayout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
