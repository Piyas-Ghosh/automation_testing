// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import Layout from "./layout/Layout";
// import Dashboard from "./page/Dashboard";
// import FlowPage from "./page/Flowpage";
// import Auth from "./api/Auth";
// import DemoForm from "./page/Demofrom";
// import Crud from "./page/Crud";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Auth route does NOT need Layout */}
//         <Route path="/auth" element={<Auth />} />

//         {/* All other routes wrapped in Layout */}
//         <Route
//           path="/"
//           element={
//             <Layout>
//               <Dashboard />
//             </Layout>
//           }
//         />
//         <Route
//           path="/flow"
//           element={
//             <Layout>
//               <FlowPage />
//             </Layout>
//           }
//         />
//         <Route
//           path="/demoform"
//           element={
//             <Layout>
//               <DemoForm />
//             </Layout>
//           } />
//           <Route
//           path="/crud"
//           element={
//             <Layout>
//               <Crud />
//             </Layout>
//           }/>
//       </Routes>

//       {/* Global Toast Container */}
//       <Toaster position="top-right" reverseOrder={false} />
//     </Router>
//   );
// }

// export default App;


// src/App.js
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
