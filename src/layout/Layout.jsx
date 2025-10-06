import Header from "../components/Header";

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <Header />
            {/* Main Content */}
            <main className="flex-1 bg-white">{children}</main>
        </div>
    );
};

export default Layout;
