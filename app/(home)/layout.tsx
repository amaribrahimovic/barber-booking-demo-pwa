import Navigator from "../(components)/Navigator";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen w-scren">
      <div className="p-4 flex-grow overflow-scroll">{children}</div>
      <Navigator />
    </div>
  );
}
