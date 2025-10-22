import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#091746] shadow-md p-5 flex items-center justify-between sticky top-0 z-50">
      <h1
        onClick={() => navigate("/")}
        className="text-xl text-white font-semibold cursor-pointer"
      >
        Dashboard
      </h1>
      {/* <div className="flex gap-2">
        <button className="bg-orange-700 text-white px-3 py-1 rounded cursor-pointer">
          Logout
        </button>
        <button
          className="bg-green-700 text-white px-3 py-1 rounded cursor-pointer"
          onClick={() => navigate("/crud")}
        >
          Add+
        </button>
      </div> */}
    </header>
  );
};

export default Header;
