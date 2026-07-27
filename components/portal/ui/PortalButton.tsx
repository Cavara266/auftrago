import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import styles from "./portal-ui.module.css";

type SharedProps = {
  children: ReactNode;
  secondary?: boolean;
};

type LinkButtonProps = SharedProps & {
  href: string;
};

type NativeButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type PortalButtonProps =
  | LinkButtonProps
  | NativeButtonProps;

export function PortalButton(
  props: PortalButtonProps
) {
  const className = props.secondary
    ? styles.secondaryButton
    : styles.gradientButton;

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        className={className}
      >
        {props.children}
      </Link>
    );
  }

  const {
    children,
    secondary: _secondary,
    ...buttonProps
  } = props as NativeButtonProps;

  return (
    <button
      className={className}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
