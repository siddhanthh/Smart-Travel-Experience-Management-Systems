import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <Sidebar />
        <main className="w-full flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
