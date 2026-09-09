"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Item = {
  id: string;
  position: number;
  description: string;
  quantity: number;
  unit: string;
  unitPriceCents: number;
  totalCents: number;
};

export default function InvoiceItemsEditor({
  invoiceId,
  items,
}: {
  invoiceId: string;
  items: Item[];
}) {
  const router = useRouter();

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [newItem, setNewItem] = useState({
    description: "",
    quantity: "1",
    unit: "pauschal",
    unitPrice: "0.00",
  });

  async function createItem() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/business/invoices/${invoiceId}/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newItem),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fehler");
      }

      setNewItem({
        description: "",
        quantity: "1",
        unit: "pauschal",
        unitPrice: "0.00",
      });

      setShowNew(false);
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Fehler"
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(itemId: string) {
    if (!confirm("Position wirklich löschen?")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/business/invoices/${invoiceId}/items`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fehler");
      }

      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Fehler"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        marginTop: 18,
        padding: 18,
        borderRadius: 16,
        border: "1px solid rgba(125,211,252,.16)",
        background: "rgba(14,22,41,.55)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: ".05em",
              color: "#7dd3fc",
            }}
          >
            POSITIONEN VERWALTEN
          </div>

          <div
            style={{
              marginTop: 5,
              fontSize: 13,
              color: "#94a3b8",
            }}
          >
            Preise und Leistungen direkt bearbeiten
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowNew(true)}
          style={{
            padding: "10px 14px",
            border: 0,
            borderRadius: 10,
            background:
              "linear-gradient(90deg,#0ea5e9,#7c3aed)",
            color: "#fff",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          + Position hinzufügen
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        {items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            invoiceId={invoiceId}
            editing={editingId === item.id}
            onEdit={() => setEditingId(item.id)}
            onCancel={() => setEditingId(null)}
            onDelete={() => deleteItem(item.id)}
          />
        ))}
      </div>

      {showNew && (
        <div
          style={{
            marginTop: 18,
            padding: 16,
            borderRadius: 14,
            border: "1px solid rgba(124,58,237,.28)",
            background: "rgba(124,58,237,.06)",
          }}
        >
          <div
            style={{
              fontWeight: 900,
              color: "#fff",
              marginBottom: 12,
            }}
          >
            Neue Position
          </div>

          <input
            value={newItem.description}
            placeholder="Beschreibung"
            onChange={(e) =>
              setNewItem({
                ...newItem,
                description: e.target.value,
              })
            }
            style={inputStyle}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
              marginTop: 10,
            }}
          >
            <input
              value={newItem.quantity}
              type="number"
              step="0.01"
              placeholder="Menge"
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  quantity: e.target.value,
                })
              }
              style={inputStyle}
            />

            <input
              value={newItem.unit}
              placeholder="Einheit"
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  unit: e.target.value,
                })
              }
              style={inputStyle}
            />

            <input
              value={newItem.unitPrice}
              type="number"
              step="0.01"
              placeholder="Preis CHF"
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  unitPrice: e.target.value,
                })
              }
              style={inputStyle}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 12,
            }}
          >
            <button
              type="button"
              onClick={createItem}
              disabled={loading}
              style={saveButton}
            >
              {loading ? "Speichert..." : "Speichern"}
            </button>

            <button
              type="button"
              onClick={() => setShowNew(false)}
              style={cancelButton}
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: 10,
            color: "#fca5a5",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

function ItemRow({
  item,
  invoiceId,
  editing,
  onEdit,
  onCancel,
  onDelete,
}: {
  item: Item;
  invoiceId: string;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    description: item.description,
    quantity: String(item.quantity),
    unit: item.unit,
    unitPrice: (item.unitPriceCents / 100).toFixed(2),
  });

  async function save() {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/business/invoices/${invoiceId}/items`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemId: item.id,
            ...form,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fehler");
      }

      onCancel();
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Fehler beim Speichern"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!editing) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "42px minmax(0,1fr) 120px 130px auto",
          gap: 12,
          alignItems: "center",
          padding: "12px 0",
          borderBottom:
            "1px solid rgba(148,163,184,.08)",
        }}
      >
        <div style={{ color: "#64748b" }}>
          {item.position}.
        </div>

        <div>
          <div
            style={{
              fontWeight: 800,
              color: "#fff",
            }}
          >
            {item.description}
          </div>

          <div
            style={{
              marginTop: 3,
              fontSize: 12,
              color: "#64748b",
            }}
          >
            {item.quantity} × CHF{" "}
            {(item.unitPriceCents / 100).toFixed(2)}
          </div>
        </div>

        <div style={{ color: "#cbd5e1" }}>
          {item.quantity} {item.unit}
        </div>

        <div
          style={{
            fontWeight: 900,
            color: "#fff",
          }}
        >
          CHF {(item.totalCents / 100).toFixed(2)}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <button
            type="button"
            onClick={onEdit}
            style={smallButton}
          >
            ✎
          </button>

          <button
            type="button"
            onClick={onDelete}
            style={{
              ...smallButton,
              color: "#fca5a5",
            }}
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 14,
        marginBottom: 10,
        borderRadius: 12,
        background: "rgba(15,23,42,.75)",
        border: "1px solid rgba(125,211,252,.15)",
      }}
    >
      <input
        value={form.description}
        onChange={(e) =>
          setForm({
            ...form,
            description: e.target.value,
          })
        }
        style={inputStyle}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 10,
          marginTop: 10,
        }}
      >
        <input
          type="number"
          step="0.01"
          value={form.quantity}
          onChange={(e) =>
            setForm({
              ...form,
              quantity: e.target.value,
            })
          }
          style={inputStyle}
        />

        <input
          value={form.unit}
          onChange={(e) =>
            setForm({
              ...form,
              unit: e.target.value,
            })
          }
          style={inputStyle}
        />

        <input
          type="number"
          step="0.01"
          value={form.unitPrice}
          onChange={(e) =>
            setForm({
              ...form,
              unitPrice: e.target.value,
            })
          }
          style={inputStyle}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 10,
        }}
      >
        <button
          type="button"
          onClick={save}
          disabled={loading}
          style={saveButton}
        >
          {loading ? "Speichert..." : "Änderung speichern"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          style={cancelButton}
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "11px 13px",
  borderRadius: 10,
  border: "1px solid rgba(148,163,184,.20)",
  background: "rgba(15,23,42,.85)",
  color: "#fff",
  outline: "none",
};

const smallButton = {
  width: 34,
  height: 34,
  borderRadius: 9,
  border: "1px solid rgba(148,163,184,.18)",
  background: "rgba(15,23,42,.65)",
  color: "#7dd3fc",
  fontWeight: 900,
  cursor: "pointer",
};

const saveButton = {
  padding: "10px 14px",
  borderRadius: 9,
  border: 0,
  background: "#16a34a",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const cancelButton = {
  padding: "10px 14px",
  borderRadius: 9,
  border: "1px solid rgba(148,163,184,.22)",
  background: "transparent",
  color: "#cbd5e1",
  fontWeight: 800,
  cursor: "pointer",
};
