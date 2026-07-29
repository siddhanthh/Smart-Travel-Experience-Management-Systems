import RegisterForm from '../components/Auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="mx-auto mt-10 max-w-sm">
      <h1 className="mb-6 text-center text-2xl font-bold text-slate-900">Create your account</h1>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
