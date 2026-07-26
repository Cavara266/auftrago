"use client";

import {
  useMemo,
  useState,
  useTransition,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  executeBulkSeoAction,
} from "./actions";

type BulkPage = {
  id: string;
  title: string;
  cityName: string;
  serviceName: string;
  publicPath: string;
  status: string;
  indexable: boolean;
  updatedAt: string;
};

type BulkAction =
  | "SET_ACTIVE"
  | "SET_DRAFT"
  | "SET_INDEXABLE"
  | "SET_NOINDEX";

export default function BulkManager({
  pages,
}: {
  pages: BulkPage[];
}) {
  const router = useRouter();

  const [selectedIds, setSelectedIds] =
    useState<string[]>([]);

  const [action, setAction] =
    useState<BulkAction>("SET_ACTIVE");

  const [message, setMessage] =
    useState("");

  const [pending, startTransition] =
    useTransition();

  const allSelected =
    pages.length > 0 &&
    pages.every((page) =>
      selectedIds.includes(page.id)
    );

  const selectedCount =
    selectedIds.length;

  const selectedSet = useMemo(
    () => new Set(selectedIds),
    [selectedIds]
  );

  function togglePage(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter(
            (currentId) =>
              currentId !== id
          )
        : [...current, id]
    );
  }

  function toggleAll() {
    if (allSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(
      pages.map((page) => page.id)
    );
  }

  function runAction() {
    if (selectedCount === 0) {
      setMessage(
        "Bitte zuerst mindestens eine Landingpage auswählen."
      );
      return;
    }

    const labels: Record<
      BulkAction,
      string
    > = {
      SET_ACTIVE:
        "auf Aktiv setzen",
      SET_DRAFT:
        "auf Entwurf setzen",
      SET_INDEXABLE:
        "für Google indexierbar machen",
      SET_NOINDEX:
        "auf noindex setzen",
    };

    const confirmed =
      window.confirm(
        `${selectedCount} Landingpages ${labels[action]}?`
      );

    if (!confirmed) {
      return;
    }

    setMessage("");

    startTransition(async () => {
      try {
        const result =
          await executeBulkSeoAction({
            ids: selectedIds,
            action,
          });

        setMessage(result.message);
        setSelectedIds([]);
        router.refresh();
      } catch (error) {
        console.error(error);

        setMessage(
          error instanceof Error
            ? error.message
            : "Die Massenbearbeitung ist fehlgeschlagen."
        );
      }
    });
  }

  return (
    <div className="bulk-manager">
      <div className="bulk-toolbar">
        <label className="select-all">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
          />

          <span>
            Alle sichtbaren auswählen
          </span>
        </label>

        <div className="selection-count">
          <strong>{selectedCount}</strong>
          <span>ausgewählt</span>
        </div>

        <select
          value={action}
          onChange={(event) =>
            setAction(
              event.target
                .value as BulkAction
            )
          }
          disabled={pending}
        >
          <option value="SET_ACTIVE">
            Status: Aktiv
          </option>

          <option value="SET_DRAFT">
            Status: Entwurf
          </option>

          <option value="SET_INDEXABLE">
            Indexierung: Aktiv
          </option>

          <option value="SET_NOINDEX">
            Indexierung: Noindex
          </option>
        </select>

        <button
          type="button"
          onClick={runAction}
          disabled={
            pending ||
            selectedCount === 0
          }
        >
          {pending
            ? "Wird ausgeführt..."
            : "Aktion ausführen"}
        </button>
      </div>

      {message ? (
        <div className="bulk-message">
          {message}
        </div>
      ) : null}

      {pages.length === 0 ? (
        <div className="empty-state">
          Keine passenden Landingpages
          gefunden.
        </div>
      ) : (
        <div className="bulk-list">
          {pages.map((page) => {
            const selected =
              selectedSet.has(page.id);

            return (
              <article
                key={page.id}
                className={
                  selected
                    ? "bulk-row selected"
                    : "bulk-row"
                }
              >
                <label className="row-checkbox">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() =>
                      togglePage(page.id)
                    }
                  />

                  <span />
                </label>

                <div className="row-content">
                  <div className="row-badges">
                    <span
                      className={
                        page.status ===
                        "ACTIVE"
                          ? "active"
                          : "draft"
                      }
                    >
                      {page.status ===
                      "ACTIVE"
                        ? "Aktiv"
                        : "Entwurf"}
                    </span>

                    <span
                      className={
                        page.indexable
                          ? "indexable"
                          : "noindex"
                      }
                    >
                      {page.indexable
                        ? "Indexierbar"
                        : "Noindex"}
                    </span>
                  </div>

                  <strong>
                    {page.title}
                  </strong>

                  <p>
                    {page.serviceName} ·{" "}
                    {page.cityName}
                  </p>

                  <small>
                    Aktualisiert:{" "}
                    {new Date(
                      page.updatedAt
                    ).toLocaleDateString(
                      "de-CH"
                    )}
                  </small>
                </div>

                <div className="row-actions">
                  <Link
                    href={`/admin/seo/landingpages/${page.id}`}
                  >
                    Bearbeiten
                  </Link>

                  <Link
                    href={page.publicPath}
                    target="_blank"
                  >
                    Öffnen
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .bulk-manager {
          display: grid;
          gap: 16px;
        }

        .bulk-toolbar {
          display: grid;
          grid-template-columns:
            minmax(220px, 1fr)
            auto
            220px
            auto;
          gap: 12px;
          align-items: center;
          padding: 16px;
          border: 1px solid
            rgba(148, 163, 184, 0.13);
          border-radius: 16px;
          background:
            rgba(255, 255, 255, 0.025);
        }

        .select-all {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #cbd5e1;
          font-size: 10px;
          font-weight: 800;
        }

        .select-all input {
          width: 17px;
          height: 17px;
        }

        .selection-count {
          display: flex;
          align-items: baseline;
          gap: 6px;
          color: #94a3b8;
          white-space: nowrap;
        }

        .selection-count strong {
          color: #ffffff;
          font-size: 20px;
        }

        .selection-count span {
          font-size: 9px;
          font-weight: 800;
        }

        select {
          min-height: 44px;
          padding: 0 12px;
          border: 1px solid
            rgba(148, 163, 184, 0.17);
          border-radius: 11px;
          outline: 0;
          background: #101625;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
        }

        button {
          min-height: 44px;
          padding: 0 17px;
          border: 0;
          border-radius: 11px;
          cursor: pointer;
          background:
            linear-gradient(
              135deg,
              #059669,
              #2563eb
            );
          color: #ffffff;
          font-size: 9px;
          font-weight: 900;
          white-space: nowrap;
        }

        button:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }

        .bulk-message {
          padding: 13px 15px;
          border: 1px solid
            rgba(34, 197, 94, 0.18);
          border-radius: 13px;
          background:
            rgba(34, 197, 94, 0.07);
          color: #86efac;
          font-size: 10px;
          font-weight: 800;
        }

        .bulk-list {
          display: grid;
          gap: 9px;
        }

        .bulk-row {
          display: grid;
          grid-template-columns:
            auto minmax(0, 1fr) auto;
          gap: 15px;
          align-items: center;
          padding: 16px;
          border: 1px solid
            rgba(148, 163, 184, 0.11);
          border-radius: 15px;
          background:
            rgba(255, 255, 255, 0.02);
          transition:
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .bulk-row.selected {
          border-color:
            rgba(59, 130, 246, 0.45);
          background:
            rgba(37, 99, 235, 0.08);
        }

        .row-checkbox {
          display: grid;
          width: 28px;
          height: 28px;
          place-items: center;
        }

        .row-checkbox input {
          width: 18px;
          height: 18px;
        }

        .row-content {
          min-width: 0;
        }

        .row-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 8px;
        }

        .row-badges span {
          display: inline-flex;
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .active,
        .indexable {
          background:
            rgba(34, 197, 94, 0.11);
          color: #86efac;
        }

        .draft {
          background:
            rgba(245, 158, 11, 0.11);
          color: #fde68a;
        }

        .noindex {
          background:
            rgba(239, 68, 68, 0.11);
          color: #fca5a5;
        }

        .row-content > strong {
          display: block;
          overflow: hidden;
          font-size: 12px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .row-content p {
          margin: 5px 0 0;
          color: #94a3b8;
          font-size: 9px;
        }

        .row-content small {
          display: block;
          margin-top: 5px;
          color: #64748b;
          font-size: 8px;
        }

        .row-actions {
          display: flex;
          gap: 7px;
        }

        .row-actions :global(a) {
          display: inline-flex;
          padding: 8px 10px;
          border: 1px solid
            rgba(148, 163, 184, 0.14);
          border-radius: 8px;
          color: #bfdbfe;
          font-size: 8px;
          font-weight: 900;
          text-decoration: none;
        }

        .empty-state {
          padding: 55px 20px;
          border: 1px dashed
            rgba(148, 163, 184, 0.17);
          border-radius: 16px;
          color: #64748b;
          text-align: center;
          font-size: 10px;
        }

        @media (max-width: 850px) {
          .bulk-toolbar {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .bulk-toolbar {
            grid-template-columns: 1fr;
          }

          .bulk-row {
            grid-template-columns:
              auto minmax(0, 1fr);
          }

          .row-actions {
            grid-column: 2;
          }
        }
      `}</style>
    </div>
  );
}
