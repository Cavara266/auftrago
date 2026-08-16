"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n/config";
import {
  translateProviderText as sharedTranslateProviderText,
} from "@/lib/i18n/provider-translator";

const SUPPORTED_LOCALES: Locale[] = [
  "de",
  "fr",
  "it",
  "en",
  "sq",
  "tr",
  "pt",
  "es",
];

function getLocaleFromPath(): Locale {
  if (typeof window === "undefined") {
    return "de";
  }

  const firstSegment = window.location.pathname
    .split("/")
    .filter(Boolean)[0];

  if (SUPPORTED_LOCALES.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }

  return "de";
}

export function translateProviderText(
  value: string,
  locale: Locale
): string {
  return sharedTranslateProviderText(value, locale);
}

function translateTextNode(node: Text, locale: Locale) {
  const original = node.nodeValue;

  if (!original || !original.trim()) {
    return;
  }

  const translated = sharedTranslateProviderText(original, locale);

  if (translated !== original) {
    node.nodeValue = translated;
  }
}

function translateElementAttributes(
  element: Element,
  locale: Locale
) {
  const attributes = [
    "title",
    "placeholder",
    "aria-label",
    "alt",
  ];

  for (const attribute of attributes) {
    const original = element.getAttribute(attribute);

    if (!original || !original.trim()) {
      continue;
    }

    const translated = sharedTranslateProviderText(
      original,
      locale
    );

    if (translated !== original) {
      element.setAttribute(attribute, translated);
    }
  }
}

function translateRoot(root: ParentNode, locale: Locale) {
  if (locale === "de") {
    return;
  }

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT
  );

  let current = walker.nextNode();

  while (current) {
    const textNode = current as Text;
    const parent = textNode.parentElement;
    const tag = parent?.tagName;

    if (
      parent &&
      tag !== "SCRIPT" &&
      tag !== "STYLE" &&
      tag !== "NOSCRIPT" &&
      tag !== "CODE" &&
      tag !== "PRE"
    ) {
      translateTextNode(textNode, locale);
    }

    current = walker.nextNode();
  }

  if (root instanceof Element) {
    translateElementAttributes(root, locale);
  }

  if ("querySelectorAll" in root) {
    const elements =
      root.querySelectorAll<HTMLElement>("*");

    elements.forEach((element) => {
      translateElementAttributes(element, locale);
    });
  }
}

export default function ProviderPageAutoTranslate() {
  useEffect(() => {
    const locale = getLocaleFromPath();

    document.documentElement.lang = locale;

    if (locale === "de") {
      return;
    }

    let scheduled = false;

    const applyTranslation = () => {
      if (scheduled) {
        return;
      }

      scheduled = true;

      requestAnimationFrame(() => {
        scheduled = false;
        translateRoot(document.body, locale);
      });
    };

    // Erst NACH React-Hydration übersetzen.
    const timer = window.setTimeout(() => {
      applyTranslation();
    }, 0);

    // Dynamisch nachgeladene React-Inhalte ebenfalls übersetzen.
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
          if (
            addedNode.nodeType === Node.TEXT_NODE ||
            addedNode.nodeType === Node.ELEMENT_NODE
          ) {
            applyTranslation();
            return;
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return null;
}
