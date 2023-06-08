import Link from "next/link";

interface DropdownProps {
  title: string;
  options: NavbarOption[];
}

export type NavbarOption = {
  text: string;
  url?: string;
};

const Dropdown = ({ title, options }: DropdownProps) => {
  return (
    <details className="dropdown relative">
      <summary>{title}</summary>
      <ul className="p-2 menu dropdown-content flex flex-col gap-2 z-50">
        {options.map((option, index) => (
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
