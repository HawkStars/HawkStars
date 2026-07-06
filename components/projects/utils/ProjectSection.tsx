const ProjectSection: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <section className={`container max-w-6xl p-4 lg:mx-auto lg:py-8 ${className}`}>
      {children}
    </section>
  );
};

export { ProjectSection };
