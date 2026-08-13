import React, { cloneElement, isValidElement, type ReactNode } from "react";

type Translator = (value: string) => string;

export function translateReactNode(
  node: ReactNode,
  translate: Translator
): ReactNode {
  if (node === null || node === undefined || typeof node === "boolean") {
    return node;
  }

  if (typeof node === "string") {
    return translate(node);
  }

  if (typeof node === "number") {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map((child) => translateReactNode(child, translate));
  }

  if (!isValidElement(node)) {
    return node;
  }

  const props = node.props as Record<string, unknown>;

  const translatedProps: Record<string, unknown> = {
    ...props,
  };

  if (typeof props.title === "string") {
    translatedProps.title = translate(props.title);
  }

  if (typeof props.placeholder === "string") {
    translatedProps.placeholder = translate(props.placeholder);
  }

  if (typeof props["aria-label"] === "string") {
    translatedProps["aria-label"] = translate(props["aria-label"]);
  }

  if (typeof props.alt === "string") {
    translatedProps.alt = translate(props.alt);
  }

  if ("children" in props) {
    translatedProps.children = translateReactNode(
      props.children as ReactNode,
      translate
    );
  }

  return cloneElement(node, translatedProps);
}
