export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col relative [&>*]:px-dynamic-container [&>*]:box-border">
        {children}
    </div>
  );
}
