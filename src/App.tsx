import { Home } from "./layouts/home";
import { Navbar } from "./layouts/Navbar";

export function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Home />
    </div>
  );
}
