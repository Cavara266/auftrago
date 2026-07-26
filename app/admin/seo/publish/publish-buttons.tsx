"use client";

import {
  useState,
  useTransition,
} from "react";

import { useRouter } from "next/navigation";

import {
  publishAllDraftLandingPages,
  publishLandingPage,
  unpublishLandingPage,
} from "./actions";

type PublishButtonsProps =
  | {
      mode: "single-publish";
      landingPageId: string;
    }
  | {
      mode: "single-unpublish";
      landingPageId: string;
    }
  | {
      mode: "publish-all";
      landingPageId?: never;
    };

export default function PublishButtons(
  props: PublishButtonsProps
) {
  const router = useRouter();

  const [pending, startTransition] =
    useTransition();

  const [message, setMessage] = useState("");

  function handleAction() {
    setMessage("");

    startTransition(async () => {
      try {
        if (props.mode === "publish-all") {
          const confirmed = window.confirm(
            "Möchtest du wirklich alle Entwürfe veröffentlichen?"
          );

          if (!confirmed) {
            return;
          }

          const result =
            await publishAllDraftLandingPages();

          setMessage(result.message);
        }

        if (props.mode === "single-publish") {
          const result = await publishLandingPage(
            props.landingPageId
          );

          setMessage(result.message);
        }

        if (props.mode === "single-unpublish") {
          const confirmed = window.confirm(
            "Möchtest du diese Landingpage wieder als Entwurf speichern?"
          );

          if (!confirmed) {
            return;
          }

          const result = await unpublishLandingPage(
            props.landingPageId
          );

          setMessage(result.message);
        }

        router.refresh();
      } catch (error) {
        console.error(error);

        setMessage(
          error instanceof Error
            ? error.message
            : "Die Aktion ist fehlgeschlagen."
        );
      }
    });
  }

  const buttonText =
    props.mode === "publish-all"
      ? "Alle Entwürfe veröffentlichen"
      : props.mode === "single-publish"
        ? "Veröffentlichen"
        : "Als Entwurf speichern";

  return (
    <div className="publish-action">
      <button
        type="button"
        onClick={handleAction}
        disabled={pending}
        className={`publish-button ${props.mode}`}
      >
        {pending ? "Wird verarbeitet..." : buttonText}
      </button>

      {message ? (
        <span className="publish-message">
          {message}
        </span>
      ) : null}

      <style jsx>{`
        .publish-action {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .publish-button {
          min-height: 40px;
          padding: 0 14px;
          border: 1px solid
            rgba(96, 165, 250, 0.3);
          border-radius: 11px;
          cursor: pointer;
          background: rgba(37, 99, 235, 0.12);
          color: #bfdbfe;
          font-size: 10px;
          font-weight: 900;
        }

        .publish-button.publish-all {
          min-height: 48px;
          border: 0;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #7c3aed
            );
          color: #ffffff;
          font-size: 11px;
        }

        .publish-button.single-unpublish {
          border-color: rgba(245, 158, 11, 0.28);
          background: rgba(245, 158, 11, 0.08);
          color: #fde68a;
        }

        .publish-button:disabled {
          cursor: wait;
          opacity: 0.6;
        }

        .publish-message {
          max-width: 270px;
          color: #86efac;
          font-size: 9px;
          font-weight: 700;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
