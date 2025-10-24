import { useState } from "react";
import { Home, User, Menu, X, CopyPlus, LayoutList } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { name: "Dashboard", icon: <Home size={20} />, path: "/" },
        { name: "Add New TestCase", icon: <CopyPlus size={20} />, path: "/add_new_testcase" },
        { name: "Test Flow", icon: <LayoutList size={20} />, path: "/testflow" },
        { name: "Profile", icon: <User size={20} />, path: "/profile" },
    ];

    return (
        <aside
            className={`${isOpen ? "w-55" : "w-16"} 
            bg-[#bcd0e3] text-black h-screen p-4 flex flex-col transition-all duration-300 sticky top-0 relative z-[999] overflow-visible`}
        >
            {/* Header / Toggle */}
            <div className="flex items-center justify-between mb-6">
                <h1 className={`cursor-pointer text-xl font-bold transition-all duration-300 ${!isOpen && "hidden"}`}>
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
                        <div key={index} className="relative group">
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 p-2 rounded-lg transition ${isActive
                                    ? "bg-[#0924aca7] text-white"
                                    : "hover:bg-[#0924aca7] hover:text-white"
                                    }`}
                            >
                                {item.icon}
                                {isOpen && <span>{item.name}</span>}
                            </Link>

                            {/* Tooltip */}
                            {!isOpen && (
                                <span
                                    className="absolute left-full top-1/2 -translate-y-1/2 ml-2 
                                     bg-gray-800 text-white text-sm px-2 py-1 rounded-md opacity-0 
                                      group-hover:opacity-100 group-hover:translate-x-1 
                                      transition-all duration-300 whitespace-nowrap z-[9999]"
                                >
                                    {item.name}
                                </span>
                            )}

                        </div>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="mt-auto">

            </div>
        </aside >
    );
};

export default Sidebar;
