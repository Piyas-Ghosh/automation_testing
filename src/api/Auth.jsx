import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Auth() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("authToken", token);
            console.log("Auth Token Saved:", token);
            
            navigate("/");
        } else {
            console.error("No token found in URL!");
        }
    }, [location, navigate]);

    return (
        <p className="fixed inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm z-1000">
            Loading...
        </p>
    );
}
