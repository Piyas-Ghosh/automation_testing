import { Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Dashboard from "../page/Dashboard";
import FlowPage from "../page/Flowpage";
import Auth from "../api/Auth";
import DemoForm from "../page/Demofrom";
import Crud from "../page/Crud";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
                path="/"
                element={
                    <Layout>
                        <Dashboard />
                    </Layout>
                }
            />
            <Route
                path="/flow"
                element={
                    <Layout>
                        <FlowPage />
                    </Layout>
                }
            />
            <Route
                path="/demoform"
                element={
                    <Layout>
                        <DemoForm />
                    </Layout>
                }
            />
            <Route
                path="/crud"
                element={
                    <Layout>
                        <Crud />
                    </Layout>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
