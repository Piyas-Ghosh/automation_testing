import { useEffect } from "react";
import TestFlow from "../components/TestFlow";

function FlowPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="p-6  min-h-screen">
            <TestFlow />
        </div>
    );
}

export default FlowPage;
