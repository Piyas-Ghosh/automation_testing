import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoaderAnimaction from "../assets/loading.json";
import Lottie from "lottie-react";

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
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm z-50">
            <Lottie animationData={LoaderAnimaction} loop={true} className="w-[500px] h-[80px]" />
            <p className="text-2xl font-bold">Loading...</p>
        </div>
    );
}
