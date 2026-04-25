import { loginAction } from "./actions";

export default function LoginForm() {
  return (
    <form
      action={async () => {
        "use server";
        await loginAction();
      }}
      className="auth-form"
    >
      <div className="auth-field">
        <label>E-Mail</label>
        <input
          name="email"
          type="email"
          placeholder="info@cavara-hauswartung.ch"
          defaultValue="info@cavara-hauswartung.ch"
        />
      </div>

      <div className="auth-field">
        <label>Passwort</label>
        <input
          name="password"
          type="password"
          placeholder="Passwort"
          defaultValue="admin"
        />
      </div>

      <button type="submit">Einloggen</button>
    </form>
  );
}