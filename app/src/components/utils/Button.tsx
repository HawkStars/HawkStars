import { tw, variantProps } from "classname-variants/react";
import React, { ReactNode } from "react";
import Spinner from "./Spinner";

interface ButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  type: "submit" | "button" | "reset";
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  variant?: "success";
  rounded?: "xl" | "full";
  padding?: "sm" | "md" | "lg";
}

const buttonProps = variantProps({
  base: tw`w-full text-center focus:outline-none focus:ring-0 cursor-pointer`,
  variants: {
    variant: {
      success: "bg-success",
    },
    rounded: {
      none: tw`rounded-none`,
      xl: tw`rounded-xl`,
      full: tw`rounded-full`,
    },
    disabled: {
      true: tw`opacity-60`,
    },
    padding: {
      sm: tw`px-3 py-2`,
      md: tw`px-4 py-3`,
      lg: tw`px-5 py-4`,
    },
  },
  defaultVariants: {
    variant: "success",
    rounded: "none",
    disabled: false,
    padding: "sm",
  },
});

const Button = ({
  children,
  onClick,
  loading = false,
  disabled,
  variant = "success",
  rounded = "xl",
  padding = "sm",
  type,
}: ButtonProps): JSX.Element => {
  return (
    <button
      {...buttonProps({ variant, rounded, padding })}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
