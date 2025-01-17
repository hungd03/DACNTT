import AccountSidebar from "@/components/AccountSidebar";

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="xl:container px-2 xl:px-4 mx-auto py-12">
      <div className="flex">
        <AccountSidebar />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
