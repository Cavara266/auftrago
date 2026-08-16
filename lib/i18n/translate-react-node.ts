import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

type Translator = (value: string) => string;

const TRANSLATABLE_STRING_PROPS = new Set([
  "title",
  "placeholder",
  "aria-label",
  "alt",
]);

export function translateReactNode(
  node: ReactNode,
  translate: Translator
): ReactNode {
  if (typeof node === "string") {
    return translate(node);
  }

  if (
    node === null ||
    node === undefined ||
    typeof node === "number" ||
    typeof node === "boolean"
  ) {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map((child) => translateReactNode(child, translate));
  }

  if (!isValidElement(node)) {
    return node;
  }

  const element = node as ReactElement<any>;
  const props = element.props ?? {};
  const nextProps: Record<string, unknown> = {};

  // Häufige sichtbare String-Props ebenfalls übersetzen.
  for (const propName of TRANSLATABLE_STRING_PROPS) {
    const propValue = props[propName];

    if (typeof propValue === "string") {
      nextProps[propName] = translate(propValue);
    }
  }

  if ("children" in props) {
    nextProps.children = Children.map(
      props.children,
      (child) => translateReactNode(child, translate)
    );
  }

  return cloneElement(element, nextProps);
}
