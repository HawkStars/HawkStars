const ProjectSection: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <section className={`py-4 ${className}`}>
      <div className='container mx-auto max-w-6xl px-4'>{children}</div>
    </section>
  );
};

export { ProjectSection };
