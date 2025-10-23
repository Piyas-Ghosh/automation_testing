import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-gray-300 shadow-md p-5 flex items-center justify-between sticky top-0 z-50">
      <h1
        onClick={() => navigate("/")}
        className="text-xl text-black font-bold cursor-pointer"
      >
        Dashboard
      </h1>
    </header>
  );
};

export default Header;
