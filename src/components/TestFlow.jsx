import { useState } from "react";
import GaugeChartStep from "./chart/chartTest";
import Drawer from "../components/Drawer";
import api from "../api/axios";
import toast from "react-hot-toast";
import loaderAnimation from "../assets/loading.json";
import Lottie from "lottie-react";

export default function TestFlow() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const [selectedStep, setSelectedStep] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState({});

  const bandsData = [
    { title: "Unsustainable", color: "#ee1f25", lowScore: -40, highScore: -20 },
    { title: "Volatile", color: "#f04922", lowScore: -20, highScore: 0 },
    { title: "Foundational", color: "#fdae19", lowScore: 0, highScore: 20 },
    { title: "Developing", color: "#f3eb0c", lowScore: 20, highScore: 40 },
    { title: "Maturing", color: "#b0d136", lowScore: 40, highScore: 60 },
    { title: "Sustainable", color: "#54b947", lowScore: 60, highScore: 80 },
    { title: "High Performing", color: "#0f9747", lowScore: 80, highScore: 100 },
  ];

  const ranges = [bandsData[0].lowScore, ...bandsData.map(band => band.highScore)];

  const handleStepClick = () => {
    const responseFromAPI = {
      name: "John Doe",
      age: 30,
      city: "New York",
      phone: "1234567890",
      gmail: "john@gmail.com",
      pan: "ABCDE1234F",
      glcode: "GL00123",
      address: "123 Main Street, New York, USA",
      date: "29-09-2001",
    };
    // Convert date fields to YYYY-MM-DD format for input type="date"
    const formattedData = Object.fromEntries(
      Object.entries(responseFromAPI).map(([key, value]) => {
        if (key.toLowerCase().includes("date") && value) {
          const [day, month, year] = value.split("-");
          return [key, `${year}-${month}-${day}`];
        }
        return [key, value];
      })
    );

    setApiData(formattedData);
    setIsDrawerOpen(true);
  };

  const handleRunTestFlow = async (testFlowName) => {
    try {
      setLoading(true);
      const payload = { testFlowName };
      const res = await api.post("/automation/test-flows", payload);
      console.log(`${testFlowName} API Success:`, res.data);
      toast.success(`${testFlowName} triggered successfully!`);
    } catch (err) {
      console.error(`${testFlowName} API Error:`, err);
      toast.error(`Failed to trigger ${testFlowName}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm z-50">
          <Lottie animationData={loaderAnimation} loop={true} className="w-300 h-70" />
        </div>
      )}

      <div className="backdrop-blur-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-4">Test Flow Visualization</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-15 gap-y-8 mt-8 animate-fade-in justify-center place-items-center">
          <Step
            header="O2CGoodsBaseTest"
            lastDate="2025-09-01"
            value={50}
            bandsData={bandsData}
            ranges={ranges}
            onClick={() => handleRunTestFlow("O2CGoodsBaseTest")}
          />
          <Step
            header="O2C Goods Invoice"
            lastDate="2025-09-05"
            value={80}
            bandsData={bandsData}
            ranges={ranges}
            onClick={() => handleRunTestFlow("O2CGoodsInvoiceFlowTest")}
          />
          <Step header="Goods Direct Invoice Collection" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="O2C Goods Flow Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="O2C Service Flow Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Proforma Goods Invoice Flow Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Proforma O2C Goods Flow Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Proforma O2C Service Flow Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Service Direct Invoice Collection" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Trading O2C Procurement Flow Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Create Customer With GST Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Create Customer With Non-GST Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Create Vendor With GST Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Create Vendor With Non-GST Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Create Assets Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Create FG For Manufacturing Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Create FG For Trading Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Create RM Item Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Create Service Purchase Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Create Service Sales Project Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Create Service Sales Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Create SFG Item Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Create FG BOM With RM And SFG Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Create FG BOM With RM SFG And FG Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="Create SFG BOM With RM Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="PO To Payment Asset Flow Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="PO To Payment Material Flow Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="PO To Payment Service Flow Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="PR To Payment Asset Flow Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="PR To Payment Material Flow Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="PR To Payment Service Flow Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
          <Step header="End To End O2C P2P Trading Flow Test" lastDate="2025-09-07" value={30} bandsData={bandsData} ranges={ranges} onClick={handleStepClick} />
        </div>
      </div>

      {/* Dynamic User Details Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        {Object.keys(apiData).length > 0 ? (
          <div className="max-h-[80vh] overflow-y-auto p-4">
            <h2 className="font-bold text-xl mb-6">Dynamic User Details</h2>

            <form
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Final Submitted Data:", apiData);
                toast.success("Form submitted successfully!");
              }}
            >
              {Object.entries(apiData).map(([key, value]) => {
                const lowerKey = key.toLowerCase();
                let inputType = "text";

                if (typeof value === "number") inputType = "number";
                else if (lowerKey.includes("email") || lowerKey.includes("gmail")) inputType = "email";
                else if (lowerKey.includes("phone") || lowerKey.includes("mobile")) inputType = "tel";
                else if (lowerKey.includes("date")) inputType = "date";

                return (
                  <div key={key} className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {key.replace(/_/g, " ")}
                    </label>
                    <input
                      type={inputType}
                      value={inputType === "date" && value ? value : value}
                      onChange={(e) => {
                        let newValue = e.target.value;

                        if (lowerKey.includes("pan") || lowerKey.includes("code")) {
                          newValue = newValue.toUpperCase();
                        }

                        if (inputType === "number") {
                          newValue = Number(newValue);
                        }

                        setApiData((prev) => ({ ...prev, [key]: newValue }));
                      }}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${lowerKey.includes("pan") || lowerKey.includes("code") ? "uppercase" : ""
                        }`}
                      placeholder={`Enter ${key.replace(/_/g, " ")}`}
                    />
                  </div>
                );
              })}
              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-[100px] bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        ) : (
          <p className="p-4">No data available</p>
        )}
      </Drawer>
    </>
  );
}

function Step({ header, lastDate, value, bandsData, ranges, onClick }) {
  return (
    <div
      className="rounded-xl p-6 border text-black border-gray-300 shadow-xl transform transition-all duration-500 hover:scale-102 w-[420px] h-[300px] cursor-pointer"
      onClick={() => onClick({ header, lastDate, value })}
    >
      <h3 className="text-md font-bold mb-2 w-90">{header}</h3>
      <div className="flex justify-between items-center mt-1 h-full">
        <div className="">
          <div className="font-semibold w-[126px]">
            <span className="text-xs font-bold">Last Testing Date: </span>
            <span className="text-xs text-blue-400" >{lastDate}</span>
          </div>
        </div>
        <div className="w-auto -ml-18">
          <GaugeChartStep value={value} bandsData={bandsData} ranges={ranges} />
        </div>
      </div>
    </div>
  );
}