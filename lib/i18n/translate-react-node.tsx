import React from "react";
import type { ReactNode, ReactElement } from "react";

export function translateReactNode(
  node: ReactNode,
  translate: (value: string) => string
): ReactNode {
  if (typeof node === "string") {
    const leading = node.match(/^\s*/)?.[0] ?? "";
    const trailing = node.match(/\s*$/)?.[0] ?? "";
    const clean = node.trim();

    if (!clean) {
      return node;
    }

    return `${leading}${translate(clean)}${trailing}`;
  }

  if (
    node === null ||
    node === undefined ||
    typeof node === "boolean" ||
    typeof node === "number"
  ) {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => (
      <React.Fragment key={index}>
        {translateReactNode(child, translate)}
      </React.Fragment>
    ));
  }

  if (React.isValidElement(node)) {
    const element = node as ReactElement<{ children?: ReactNode }>;

    if (!("children" in element.props)) {
      return element;
    }

    return React.cloneElement(element, {
      children: translateReactNode(element.props.children, translate),
    });
  }

  return node;
}
