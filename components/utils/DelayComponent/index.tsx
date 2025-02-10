import { useEffect, useState, type ReactElement } from 'react';

type DelayComponentProps = {
  children: ReactElement;
  fallback: ReactElement;
  delay?: number;
};

/**
 * Lazy + Suspense only works when data fetching is involved.
 * If you want to delay rendering of a component without data fetching use this one instead
 * @param children - Component to render after delay
 * @param fallback - Component to render while waiting ( Skeleton, Spinner, etc)
 * @param delay - Delay in milliseconds to show the children
 */
const DelayComponent = ({ children, fallback, delay = 2000 }: DelayComponentProps) => {
  const [showComponent, setShowComponent] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComponent(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return showComponent ? children : fallback;
};

export default DelayComponent;
