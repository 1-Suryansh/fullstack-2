// ============================================================
//  EXPERIMENT 1.3.1
//  No router needed here. One question decides the whole screen:
//  is there a valid token or not?
// ============================================================
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function Screen() {
  const { user, loading } = useAuth();

  if (loading) return <p style={{ padding: 24 }}>Checking your session...</p>;

  return user ? <Dashboard /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <Screen />
    </AuthProvider>
  );
}
