import { registerAction } from "./actions";

export default function RegisterForm() {
  return (
    <form
      action={async () => {
        "use server";
        await registerAction();
      }}
      className="auth-form"
    >
      <div className="auth-field">
        <label>Firmenname</label>
        <input name="companyName" type="text" placeholder="Firma GmbH" />
      </div>

      <div className="auth-field">
        <label>E-Mail</label>
        <input
          name="email"
          type="email"
          placeholder="info@firma.ch"
        />
      </div>

      <div className="auth-field">
        <label>Telefon</label>
        <input
          name="phone"
          type="text"
          placeholder="+41 79 123 45 67"
        />
      </div>

      <div className="auth-field">
        <label>Passwort</label>
        <input
          name="password"
          type="password"
          placeholder="Passwort"
        />
      </div>

      <button type="submit">Registrieren</button>
    </form>
  );
}