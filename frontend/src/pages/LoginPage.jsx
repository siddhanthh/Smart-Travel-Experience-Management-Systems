import LoginForm from '../components/Auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="mx-auto mt-10 max-w-sm">
      <h1 className="mb-6 text-center text-2xl font-bold text-slate-900">Log in to STEMS</h1>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <LoginForm />
      </div>
    </div>
  );
}
