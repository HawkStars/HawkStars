import * as LucideIcons from 'lucide-react';

const getIcon = (iconName?: string | null) => {
  if (!iconName) return null;
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType>)[
    iconName
  ] as LucideIcons.LucideIcon;

  if (!Icon) {
    console.warn(`Icon "${iconName}" not found in lucide-react`);
    return null;
  }

  return <Icon className='size-6' />;
};

export { getIcon };
