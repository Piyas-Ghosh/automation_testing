import Header from "../components/Header";
import Sidebar from "../components/sidebar";

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* sidebar */}
            <Sidebar />
            <div className="flex flex-col flex-1">
                {/* header */}
                <Header />

                {/* main content */}
                <main className="flex-1 bg-gray-50 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
