import { tw, variantProps } from "classname-variants/react";
import React, { ReactNode } from "react";
import Spinner from "./Spinner";

interface ButtonProps {
  /**
   * Optional click handler
   */
  onClick?: (e: React.MouseEvent) => void;
  /**
   * Type of button
   */
  type: "submit" | "button" | "reset";
  /**
   * Elements inside the button
   */
  children: ReactNode;
  /**
   * Styling - Loading state
   */
  loading?: boolean;
  /**
   * Styling -  Disabled state
   */
  disabled?: boolean;
  /**
   * Styling - Type of Button
   */
  variant?: "success" | "informative";
  /**
   * Styling -  Rounded Values
   */
  rounded?: "xl" | "full";
  /**
   * Styling - Padding of the button
   */
  padding?: "sm" | "md" | "lg";
  /**
   * Styling - Only has the lines of the variant
   */
  outline?: boolean;
}

const buttonProps = variantProps({
  base: tw`w-fit text-center focus:outline-none focus:ring-0 cursor-pointer`,
  variants: {
    variant: {
      success: "bg-green border border-green text-white fill-white",
      informative: "",
    },
    rounded: {
      none: tw`rounded-none`,
      xl: tw`rounded-xl`,
      full: tw`rounded-full`,
    },
    disabled: {
      true: tw`opacity-50`,
    },
    padding: {
      sm: tw`px-3 py-2`,
      md: tw`px-4 py-3`,
      lg: tw`px-5 py-4`,
    },
    outline: {
      true: tw`!bg-transparent`,
    },
  },
  defaultVariants: {
    variant: "success",
    rounded: "xl",
    disabled: false,
    padding: "sm",
    outline: false,
  },
});

const Button = (props: ButtonProps): JSX.Element => {
  const { disabled, type, children, onClick, loading } = props;
  return (
    <button
      {...buttonProps({ ...props })}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
