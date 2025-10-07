import LineChart from "../components/chart/LineChart";
import GaugeChart from "../components/chart/GaugeChart";
import StatsCard from "../components/StatsCard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className=" text-black min-h-screen">
      <div className="w-full px-4 md:px-12 py-12">
        {/* Hero */}

        {/* Charts */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Performance Over Time (Bigger Section) */}
          <div className="md:col-span-2 backdrop-blur-xl rounded-2xl p-6 border border-gray-300 shadow-xl">
            <h3 className="text-2xl font-semibold  mb-4">
              Performance Over Time
            </h3>
            <LineChart />
          </div>

          {/* Application Health (Smaller Section) */}
          <div className="backdrop-blur-lg rounded-2xl p-6 border border-gray-300 shadow-lg flex flex-col">
            <h3 className="text-2xl font-semibold  mb-4">
              Application Health
            </h3>
            <GaugeChart />
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <StatsCard
            title="Total Tests"
            value="1,247"
            icon="📊"
            gradient="from-blue-500 to-blue-600"
          />
          <StatsCard
            title="Total Pass"
            value="1,089"
            icon="✅"
            gradient="from-green-500 to-green-600"
          />
          <StatsCard
            title="Total Fail"
            value="158"
            icon="❌"
            gradient="from-red-500 to-red-500"
          />
        </div>

        {/* Test Flow */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold  mb-4">Test Flow Visualization</h2>
          <button
            onClick={() => navigate('/flow')}
            className="bg-gradient-to-r from-blue-900 to-blue-500 hover:from-blue-500 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View Test Flow
          </button>
        </div>
      </div>
    </div>
  );
}

