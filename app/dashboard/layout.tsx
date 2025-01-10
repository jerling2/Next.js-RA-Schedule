import DashboardHeader from "@/components/DashboardHeader";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <DashboardHeader />
        <div className="relative">
            {children}
        </div>
    </>
  );
}
