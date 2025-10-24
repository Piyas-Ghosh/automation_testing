import { X } from 'lucide-react';

const Drawer = ({ isOpen, onClose, children }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-md transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          } z-[9998]`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-[60%] bg-white  shadow-xl transform transition-transform duration-300 ${isOpen
          ? "translate-x-0 visible pointer-events-auto"
          : "translate-x-full invisible pointer-events-none"
          } z-[9999]`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="p-1 m-2 text-gray-700 hover:text-black cursor-pointer"
        >
          <X />
        </button>
        

        {/* Drawer content */}
        <div className="p-1">{children}</div>
      </div>
    </>
  );
};

export default Drawer;
