import Link from "next/link";

/* TODO CHANGE THIS */

interface DropdownProps {
  title: string;
  options: NavbarOption[];
  tabIndex: number;
}

export type NavbarOption = {
  text: string;
  url?: string;
};
const Dropdown = ({ title, options, tabIndex }: DropdownProps) => {
  return (
    <details className="dropdown">
      <summary tabIndex={tabIndex}>{title}</summary>
      <ul
        tabIndex={tabIndex}
        className="dropdown-content menu z-50 flex flex-col gap-2 p-2"
      >
        {options?.map((option, index) => (
          <li key={index}>
            {option.url ? (
              <Link href={option.url}>{option.text}</Link>
            ) : (
              option.text
            )}
          </li>
        ))}
      </ul>
    </details>
  );
};

export default Dropdown;
