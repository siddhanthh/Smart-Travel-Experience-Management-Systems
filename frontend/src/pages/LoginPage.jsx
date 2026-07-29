import LoginForm from '../components/Auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-blue-600">STEMS</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Plan group trips, split expenses, and share memories.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
