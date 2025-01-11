export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col relative [&>.relative]:px-dynamic-container [&>.relative]:box-border">
        {children}
    </div>
  );
}
