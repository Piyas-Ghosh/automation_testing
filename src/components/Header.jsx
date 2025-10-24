// import { useNavigate } from "react-router-dom";

// const Header = () => {
//   const navigate = useNavigate();

//   return (
//     <header className="border-b border-gray-300 shadow-md p-5 flex items-center justify-between sticky top-0 z-50">
//       <h1
//         onClick={() => navigate("/")}
//         className="text-xl text-black font-bold cursor-pointer"
//       >
//         Dashboard
//       </h1>
//     </header>
//   );
// };

// export default Header;

import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const formatPathName = (path) => {
    if (path === "/") return "Dashboard";
    const formatted = path
      .replace("/", "")
      .split("/")
      .map((segment) =>
        segment
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      )
      .join(" / ");
    return formatted;
  };

  return (
    <header className="border-b border-gray-300 shadow-md p-5 flex items-center justify-between sticky top-0 z-50">
      <h1
        onClick={() => navigate("/")}
        className="text-xl text-black font-bold cursor-pointer"
      >
        {formatPathName(location.pathname)}
      </h1>
    </header>
  );
};

export default Header;
