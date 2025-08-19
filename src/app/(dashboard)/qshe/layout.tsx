
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-dvh bg-white">
      <section className="mx-auto w-full max-w-7xl px-4 py-8">
        {children}
      </section>
    </main>

  );
}
