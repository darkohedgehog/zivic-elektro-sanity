import "../../styles/globals.css";
export const metadata = {
  title: "Živić-Elektro",
  description: "Veleprodaja i maloprodaja elektro materijala",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-hr">
      <body>{children}</body>
    </html>
  );
}