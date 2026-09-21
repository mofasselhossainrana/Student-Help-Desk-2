import Sidebar from './sidebar';

function AppLayout({ children, onLogout }) {
  return <div className="app-shell"><Sidebar onLogout={onLogout} /><main className="app-main">{children}</main></div>;
}

export default AppLayout;
