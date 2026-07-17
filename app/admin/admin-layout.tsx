import type { ReactNode } from "react";
import AdminNav from "./AdminNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <AdminNav />
      </aside>

      <div className="admin-content">{children}</div>

      <style>{`
        .admin-shell {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 260px minmax(0, 1fr);
          background:
            radial-gradient(circle at 14% 12%, rgba(14,165,233,.11), transparent 30%),
            radial-gradient(circle at 92% 20%, rgba(99,102,241,.12), transparent 34%),
            #06111f;
        }

        .admin-sidebar {
          position: sticky;
          top: 0;
          height: 100vh;
          padding: 22px 16px;
          border-right: 1px solid rgba(255,255,255,.08);
          background: linear-gradient(180deg, rgba(7,16,31,.98), rgba(8,18,34,.95));
          backdrop-filter: blur(18px);
          display: flex;
          flex-direction: column;
          z-index: 40;
        }

        .admin-content {
          min-width: 0;
        }

        .admin-menu-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 8px 24px;
        }

        .admin-menu-logo {
          width: 44px;
          height: 44px;
          border-radius: 15px;
          display: grid;
          place-items: center;
          font-weight: 950;
          font-size: 20px;
          color: white;
          background: linear-gradient(135deg, #0ea5e9, #6366f1);
          box-shadow: 0 16px 40px rgba(59,130,246,.28);
        }

        .admin-menu-brand strong,
        .admin-menu-brand span {
          display: block;
        }

        .admin-menu-brand strong {
          font-size: 18px;
          letter-spacing: -.02em;
        }

        .admin-menu-brand span {
          margin-top: 3px;
          color: rgba(255,255,255,.42);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .admin-menu-nav {
          display: grid;
          gap: 7px;
        }

        .admin-menu-link {
          position: relative;
          display: grid;
          grid-template-columns: 36px minmax(0,1fr) 4px;
          align-items: center;
          gap: 10px;
          padding: 12px 12px;
          border-radius: 15px;
          color: rgba(255,255,255,.58);
          text-decoration: none;
          font-size: 14px;
          font-weight: 780;
          border: 1px solid transparent;
          transition: .18s ease;
        }

        .admin-menu-link:hover {
          color: white;
          background: rgba(255,255,255,.045);
          border-color: rgba(255,255,255,.08);
          transform: translateX(2px);
        }

        .admin-menu-link.is-active {
          color: white;
          background: linear-gradient(135deg, rgba(14,165,233,.17), rgba(99,102,241,.16));
          border-color: rgba(96,165,250,.24);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.04), 0 12px 34px rgba(2,132,199,.08);
        }

        .admin-menu-link.is-active i {
          width: 4px;
          height: 24px;
          border-radius: 99px;
          background: linear-gradient(180deg, #38bdf8, #818cf8);
          box-shadow: 0 0 18px rgba(56,189,248,.7);
        }

        .admin-menu-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: rgba(255,255,255,.045);
          color: rgba(255,255,255,.8);
          font-size: 14px;
        }

        .admin-menu-link.is-active .admin-menu-icon {
          background: rgba(56,189,248,.12);
          color: #bae6fd;
        }

        .admin-menu-footer {
          margin-top: auto;
          padding-top: 18px;
          border-top: 1px solid rgba(255,255,255,.07);
        }

        .admin-menu-logout {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 14px;
          color: rgba(255,255,255,.52);
          text-decoration: none;
          font-weight: 800;
          font-size: 14px;
        }

        .admin-menu-logout:hover {
          color: #fecaca;
          background: rgba(239,68,68,.08);
        }

        @media (max-width: 980px) {
          .admin-shell {
            grid-template-columns: 1fr;
          }

          .admin-sidebar {
            position: sticky;
            top: 0;
            height: auto;
            padding: 10px 14px;
            border-right: 0;
            border-bottom: 1px solid rgba(255,255,255,.08);
            overflow-x: auto;
          }

          .admin-menu-brand,
          .admin-menu-footer {
            display: none;
          }

          .admin-menu-nav {
            display: flex;
            gap: 8px;
            min-width: max-content;
          }

          .admin-menu-link {
            grid-template-columns: 28px auto;
            padding: 9px 12px;
            border-radius: 13px;
          }

          .admin-menu-link i {
            display: none;
          }

          .admin-menu-icon {
            width: 28px;
            height: 28px;
            border-radius: 9px;
          }
        }

        @media (max-width: 560px) {
          .admin-sidebar {
            padding-inline: 8px;
          }

          .admin-menu-link {
            font-size: 13px;
            padding: 8px 10px;
          }
        }
      `}</style>
    </div>
  );
}