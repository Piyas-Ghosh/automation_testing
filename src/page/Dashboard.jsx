import LineChart from "../components/chart/LineChart";
import GaugeChart from "../components/chart/GaugeChart";
import StatsCard from "../components/StatsCard";
import ForceDirectedChart from "../components/chart/Force_Directed";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import api from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState("Select Date Range");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stats, setStats] = useState({
    totalTest: 0,
    passedTest: 0,
    failedTest: 0,
  })

  // useEffect(() => {
  //   const colors = ["#66BFBF", "#EAF6F6", "#FF0063"];
  //   let animateCircleFragment = document.createDocumentFragment();

  //   function animateCircle(event) {
  //     const circleDivElem = document.createElement("div");
  //     Object.assign(circleDivElem.style, {
  //       position: "fixed",
  //       width: "30px",
  //       height: "30px",
  //       border: "2px solid #000",
  //       borderTopLeftRadius: "50%",
  //       borderTopRightRadius: "50%",
  //       pointerEvents: "none",
  //       zIndex: "9999",
  //       left: `${event.clientX}px`,
  //       top: `${event.clientY}px`,
  //       transition: "all 0.6s ease-out",
  //       opacity: "1",
  //       filter: "blur(1px)",
  //     });

  //     animateCircleFragment.appendChild(circleDivElem);
  //     document.body.appendChild(animateCircleFragment);

  //     // Random border glow color
  //     const color = colors[Math.floor(Math.random() * colors.length)];
  //     circleDivElem.style.borderColor = color;
  //     circleDivElem.style.boxShadow = `0 0 10px ${color}`;

  //     // Animate expansion + fade
  //     requestAnimationFrame(() => {
  //       circleDivElem.style.transform = "translate(-20px, -20px) scale(2)";
  //       circleDivElem.style.opacity = "0";
  //     });

  //     // Remove after animation completes
  //     setTimeout(() => circleDivElem.remove(), 600);
  //   }

  //   document.addEventListener("mousemove", animateCircle);
  //   return () => document.removeEventListener("mousemove", animateCircle);
  // }, []);



  // Calculate default date range
  const today = new Date('2025-10-24');
  const defaultEndDate = today.toISOString().split('T')[0];
  const defaultStartDate = new Date(today);
  defaultStartDate.setDate(today.getDate() - 7);
  const formattedDefaultStartDate = defaultStartDate.toISOString().split('T')[0];

  const fetchDataDescription = useCallback(async (startDate, endDate) => {
    const payload = { startDate, endDate };
    try {
      const response = await api.post("/automation/summary-data", payload);

      setStats({
        totalTest: response.data.totalTest || 0,
        passedTest: response.data.passedTest || 0,
        failedTest: response.data.failedTest || 0,
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching test execution data from ${startDate} to ${endDate}:`, error);
    }
  }, []);

  useEffect(() => {
    setStartDate(formattedDefaultStartDate);
    setEndDate(defaultEndDate);
    setSelectedRange(`${formattedDefaultStartDate} to ${defaultEndDate}`);
    fetchDataDescription(formattedDefaultStartDate, defaultEndDate);
  }, []);

  // Handle date selection
  const handleDateSubmit = async () => {
    if (startDate && endDate) {
      setSelectedRange(`${startDate} to ${endDate}`);
      setIsOpen(false);
      await fetchDataDescription(startDate, endDate);
    } else {
      alert("Please select both start and end dates.");
    }
  };

  // Define bandsData and ranges
  const bandsData = [
    { title: "Poor", color: "#d15c5a", lowScore: 0, highScore: 30 },
    { title: "Moderate", color: "#c9b74f", lowScore: 31, highScore: 60 },
    { title: "Good", color: "#51c251", lowScore: 61, highScore: 100 },
  ];
  const ranges = [bandsData[0].lowScore, ...bandsData.map(band => band.highScore)];



  return (
    <div className="text-black min-h-screen">
      <div className="w-full px-4 md:px-12 py-12">
        {/* Hero */}

        {/* Charts */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Performance Over Time (Bigger Section) */}
          <div className="md:col-span-2 backdrop-blur-xl rounded-2xl p-6 border border-gray-300 shadow-xl">
            <h3 className="text-2xl font-semibold mb-4">
              Performance Over Time
            </h3>
            <LineChart />
          </div>

          {/* Application Health (Smaller Section) */}
          <div className="backdrop-blur-lg rounded-2xl p-6 border border-gray-300 shadow-lg flex flex-col items-start justify-center text-center">
            <h3 className="text-2xl font-semibold mb-25">
              Application Health
            </h3>
            <div className="w-full flex justify-center">
              <GaugeChart value={75} bandsData={bandsData} ranges={ranges} />
            </div>
          </div>

          <div className="md:col-span-3 backdrop-blur-lg rounded-2xl p-6 border border-gray-300 shadow-lg flex flex-col ">
            <h3 className="text-2xl font-semibold mb-4">
              Application Health
            </h3>
            <ForceDirectedChart />
          </div>
        </div>

        {/* Stats */}
        <div className="relative inline-block text-left mb-6">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-between w-64 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
          >
            {selectedRange}
            <ChevronDown
              className={`ml-2 h-5 w-5 text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isOpen && (
            <div className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-blue-100 ring-opacity-50 overflow-hidden transition-all duration-200 ease-out transform scale-100 opacity-100">
              <div className="py-4 px-4 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <button
                  onClick={handleDateSubmit}
                  className="w-full bg-blue-950 hover:bg-blue-900 cursor-pointer text-white py-2 rounded-md transition-colors duration-150"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <StatsCard
            title="Total Tests"
            value={stats.totalTest}
            icon="📊"
            gradient="from-blue-300 to-blue-400"
          />
          <StatsCard
            title="Total Pass"
            value={stats.passedTest}
            icon="✅"
            gradient="from-green-300 to-green-500"
          />
          <StatsCard
            title="Total Fail"
            value={stats.failedTest}
            icon="❌"
            gradient="bg-[#d46757]"
          />
        </div>

        {/* Test Flow */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Test Flow Visualization</h2>
          <button
            onClick={() => navigate('/testflow')}
            className="bg-gradient-to-r from-blue-900 to-blue-500 hover:from-blue-500 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
          >
            View Test Flow
          </button>
        </div>
      </div>
    </div>
  );
}