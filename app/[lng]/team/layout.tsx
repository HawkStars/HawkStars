export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='px-8 pb-5 pt-10 lg:px-14 lg:pb-10 lg:pl-20 lg:pt-40'>
      {children}
    </section>
  );
}
