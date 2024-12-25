import { PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { PropsWithChildren, useRef, useEffect } from 'react';

const DEBOUNCE = 100;

export function PopoverHoverer({
  children,
  isOpen,
  close,
}: PropsWithChildren<{ isOpen: boolean; close: () => void }>) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const clear = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseEnter = () => {
    clear();
    if (!isOpen) {
      buttonRef.current?.click();
    }
  };

  const handleMouseLeave = () => {
    clear();

    timeoutRef.current = setTimeout(() => {
      close();
    }, DEBOUNCE);
  };

  useEffect(() => {
    return () => {
      clear();
    };
  }, [close]);

  return (
    <>
      {/* Ensure your custom component sets an `onClick` prop (even if it's a no-op function)
            otherwise `event.preventDefault()` will be called and default browser behaviour won't work
          @see https://github.com/tailwindlabs/headlessui/issues/3561 */}
      <PopoverButton
        as={MyLinkComponent}
        href='/'
        ref={buttonRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        My Link
      </PopoverButton>

      <Transition show={isOpen}>
        <PopoverPanel onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {children}
        </PopoverPanel>
      </Transition>
    </>
  );
}

/// TODO: improve this
const MyLinkComponent = (props: any) => {
  return <div className='' onClick={props.onClick}></div>;
};
