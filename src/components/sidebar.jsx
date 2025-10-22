import { useState } from "react";
import { Home, User, Menu, X, CopyPlus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { name: "Dashboard", icon: <Home size={20} />, path: "/" },
        { name: "Add Test Case", icon: <CopyPlus size={20} />, path: "/crud" },
        { name: "Logout", icon: <User size={20} />, path: " " },
    ];

    return (
        <aside
            className={`${isOpen ? "w-45" : "w-16"
                } bg-[#091746] text-white h-auto p-4 flex flex-col transition-all duration-300 sticky `}
        >
            {/* Header / Toggle */}
            <div className="flex items-center justify-between mb-6">
                <h1
                    className={`cursor-pointer text-xl font-bold transition-all duration-300 ${!isOpen && "hidden"
                        }`}
                >
                    Logo
                </h1>
                <button onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                    {isOpen ? <X size={20} /> : <Menu size={25} />}
                </button>
            </div>

            {/* Menu Items */}
            <nav className="flex flex-col gap-2">
                {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={index}
                            to={item.path}
                            className={`flex items-center gap-3 p-2 rounded-lg transition ${isActive ? "bg-[#1d2a6d]" : "hover:bg-[#1d2a6d]"
                                }`}
                        >
                            {item.icon}
                            {isOpen && <span>{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="mt-auto">
                <p
                    className={`text-sm text-gray-400 transition-all ${!isOpen && "hidden"
                        }`}
                >
                    © 2025 vitwo
                </p>
            </div>
        </aside>
    );
};

export default Sidebar;
