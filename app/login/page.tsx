import LoginForm from "./login-form";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

      <div className="grid grid-cols-2 gap-10 max-w-5xl w-full p-10">

        {/* Left */}
        <div className="space-y-6">
          <div className="text-xs uppercase text-white/50 tracking-widest">
            Premium Vermittlung
          </div>

          <h1 className="text-4xl font-bold">
            Leads, die sich lohnen.
          </h1>

          <p className="text-white/60">
            Demo-Flow: Leads ansehen → Kontakt freischalten → Credits &
            Transaktionen prüfen.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">

          <h2 className="text-xl font-semibold mb-6">Login</h2>

          <LoginForm />

          <div className="text-xs text-white/50 mt-6">
            Demo Zugang: demo@auftrago.local / demo1234
          </div>

        </div>
      </div>
    </div>
  );
}