export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
      STEMS — Smart Travel Experience Management System © {new Date().getFullYear()}
    </footer>
  );
}
