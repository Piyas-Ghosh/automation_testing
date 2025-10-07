import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./router/AppRoutes";

function App() {
  return (
    <Router>
      <AppRoutes />
      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
}

export default App;
