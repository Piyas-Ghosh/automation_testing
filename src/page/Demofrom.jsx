import { useEffect, useState } from "react";

export default function DemoForm() {
    const [formData, setFormData] = useState({
        from: "",
        to: "",
        date: "",
        status: "",
        amount: ""
    });

    useEffect(() => {
        // Simulating API call with demo JSON
        const apiResponse = {
            id: 1,
            from: "NewTown",
            to: "OldTown",
            date: "2025-09-24",
            status: "active",
            amount: 2500
        };

        // Auto-fill form
        setFormData({
            from: apiResponse.from,
            to: apiResponse.to,
            date: apiResponse.date,
            status: apiResponse.status,
            amount: apiResponse.amount
        });
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <form className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-5 border border-gray-200">
                <h2 className="text-2xl font-bold text-center text-indigo-600 mb-4">
                    Demo Form
                </h2>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        From:
                    </label>
                    <input
                        type="text"
                        value={formData.from}
                        onChange={(e) =>
                            setFormData({ ...formData, from: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                        placeholder="Enter from location"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        To:
                    </label>
                    <input
                        type="text"
                        value={formData.to}
                        onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                        placeholder="Enter destination"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date:
                    </label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status:
                    </label>
                    <input
                        type="text"
                        value={formData.status}
                        onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                        placeholder="Enter status"
                    />
                </div>

                {/* Amount Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount:
                    </label>
                    <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                        placeholder="Enter amount"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
