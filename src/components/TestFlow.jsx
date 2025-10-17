import { useState, useCallback, memo, useEffect } from "react";
import GaugeChartStep from "./chart/chartTest";
import Drawer from "../components/Drawer";
import api from "../api/axios";
import toast from "react-hot-toast";
import loaderAnimation from "../assets/loading.json";
import Lottie from "lottie-react";
import { useTransition } from "react";

export default function TestFlow() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedTestClassName, setSelectedTestClassName] = useState("");
  const [initialDrawerData, setInitialDrawerData] = useState({});
  const [stepData, setStepData] = useState([]);

  const bandsData = [
    { title: "Poor", color: "#FF0000", lowScore: 0, highScore: 30 },
    { title: "Moderate", color: "#FFFF00", lowScore: 31, highScore: 60 },
    { title: "Good", color: "#00FF00", lowScore: 61, highScore: 100 },
  ];

  const initializeStepData = () => [
    { header: "O2C Goods Invoice Flow Test", lastDate: "2025-09-01", value: 0 },
    { header: "O2C Goods Invoice", lastDate: "2025-09-05", value: 0 },
    { header: "O2C Goods Flow Test", lastDate: "2025-09-07", value: 0 },
    { header: "O2C Service Flow Test", lastDate: "2025-09-07", value: 0 },
    { header: "Goods Direct Invoice Collection", lastDate: "2025-09-07", value: 0 },
    { header: "Proforma Goods Invoice Flow Test", lastDate: "2025-09-07", value: 0 },
    { header: "Proforma O2C Goods Flow Test", lastDate: "2025-09-07", value: 0 },
    { header: "Proforma O2C Service Flow Test", lastDate: "2025-09-07", value: 0 },
    { header: "Service Direct Invoice Collection", lastDate: "2025-09-07", value: 0 },
    { header: "Trading O2C Procurement Flow Test", lastDate: "2025-09-07", value: 0 },
    { header: "Create Customer With Gst Test", lastDate: "2025-09-07", value: 0 },
    { header: "Create Customer With Non-GST Test", lastDate: "2025-09-07", value: 0 },
    { header: "Create Vendor With GST Test", lastDate: "2025-09-07", value: 0 },
    { header: "Create Vendor With Non-GST Test", lastDate: "2025-09-07", value: 0 },
    { header: "Create Assets Test", lastDate: "2025-09-07", value: 30 },
    { header: "Create FG For Manufacturing Test", lastDate: "2025-09-07", value: 0 },
    { header: "Create FG For Trading Test", lastDate: "2025-09-07", value: 0 },
    { header: "Create RM Item Test", lastDate: "2025-09-07", value: 0 },
    { header: "Create Service Purchase Test", lastDate: "2025-09-07", value: 0 },
    { header: "Create Service Sales Project Test", lastDate: "2025-09-07", value: 0 },
    { header: "Create Service Sales Test", lastDate: "2025-09-07", value: 0 },
    { header: "Create SFG Item Test", lastDate: "2025-09-07", value: 0 },
    { header: "Create FG BOM With RM And SFG Test", lastDate: "2025-09-07", value: 0 },
    { header: "Create FG BOM With RM SFG And FG Test", lastDate: "2025-09-07", value: 0 },
    { header: "Create SFG BOM With RM Test", lastDate: "2025-09-07", value: 0 },
    { header: "PO To Payment Asset Flow Test", lastDate: "2025-09-07", value: 0 },
    { header: "PO To Payment Material Flow Test", lastDate: "2025-09-07", value: 0 },
    { header: "PO To Payment Service Flow Test", lastDate: "2025-09-07", value: 0 },
    { header: "PR To Payment Asset Flow Test", lastDate: "2025-09-07", value: 0 },
    { header: "PR To Payment Material Flow Test", lastDate: "2025-09-07", value: 0 },
    { header: "PR To Payment Service Flow Test", lastDate: "2025-09-07", value: 0 },
    { header: "End To End O2C P2P Trading Flow Test", lastDate: "2025-09-07", value: 0 },
  ];

  const handleGrap = useCallback(async (header) => {
    const payload = { testFlowName: header };
    try {
      const response = await api.post("/automation/test-health-graph", payload);
      console.log(`Response for ${header}:`, response.data);

      const passRate = response.data.passRate || 0;
      const testingDate = response.data.testingDate || null;
      setStepData(prevStepData =>
        prevStepData.map(step =>
          step.header === header
            ? {
              ...step,
              value: Math.round(passRate),
              lastDate: testingDate || step.lastDate
            }
            : step
        )
      );
    } catch (error) {
      console.error(`Error fetching test graph data for ${header}:`, error);
    }
  }, []);

  // Function to fetch data for all steps sequentially
  const fetchAllStepData = useCallback(async () => {
    const initialData = initializeStepData();
    setStepData(initialData);

    for (const step of initialData) {
      await handleGrap(step.header);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

  }, [handleGrap]);

  useEffect(() => {
    fetchAllStepData();
  }, [fetchAllStepData]);

  const ranges = [bandsData[0].lowScore, ...bandsData.map(band => band.highScore)];

  const handleSubmit = async (testClassName) => {
    if (!testClassName) {
      toast.error("No test flow selected.");
      return;
    }

    const payload = { testClassName };

    try {
      const response = await api.post('/automation/submit-test-execution', payload);
      console.log("Submit response:", response.data);
      toast.success("Form submitted successfully!");
      setIsDrawerOpen(false);
      setSelectedTestClassName("");
      setInitialDrawerData({});
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error("Failed to submit form. Please try again.");
    }
  };

  const handleUpdate = useCallback(async (testClassName, overrides) => {
    if (!testClassName) {
      toast.error("No test flow selected.");
      return;
    }

    const payload = { testClassName, ...overrides };

    startTransition(async () => {
      try {
        const response = await api.post('automation/load-data', payload);

        const dbConfig = response.data.dbConfig;
        const overridesResponse = response.data.overrides || {};
        const mergedData = { ...dbConfig, ...overridesResponse };

        const formattedData = Object.fromEntries(
          Object.entries(mergedData).map(([key, value]) => {
            if (key.toLowerCase().includes("date") && value && typeof value === 'string') {
              const parts = value.split("-");
              if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
                const [day, month, year] = parts;
                return [key, `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`];
              }
            }
            return [key, value];
          })
        );

        setInitialDrawerData(formattedData);
        toast.success("Updated successfully!");
      } catch (error) {
        console.error('Error updating data:', error);
        toast.error("Failed to update data. Please try again.");
      }
    });
  }, []);

  const handleStepClick = useCallback((stepData) => {
    const testClassName = stepData.header.replace(/\s+/g, '');
    setSelectedTestClassName(testClassName);
    setIsDrawerOpen(true);
    setInitialDrawerData({});

    startTransition(async () => {
      try {
        const payload = { testClassName };
        const response = await api.post('automation/load-data', payload);
        const responseFromAPI = response['data']['dbConfig'];

        const formattedData = Object.fromEntries(
          Object.entries(responseFromAPI).map(([key, value]) => {
            if (key.toLowerCase().includes("date") && value && typeof value === 'string') {
              const parts = value.split("-");
              if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
                const [day, month, year] = parts;
                return [key, `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`];
              }
            }
            return [key, value];
          })
        );

        setInitialDrawerData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setInitialDrawerData({});
      }
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedTestClassName("");
    setInitialDrawerData({});
  }, []);

  return (
    <>
      <div className="backdrop-blur-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-4">Test Flow Visualization</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-15 gap-y-8 mt-8 animate-fade-in justify-center place-items-center">
          {stepData.map((step, index) => (
            <Step
              key={index}
              header={step.header}
              lastDate={step.lastDate}
              value={step.value}
              bandsData={bandsData}
              ranges={ranges}
              onClick={handleStepClick}
            />
          ))}
        </div>
      </div>

      <Drawer className="z-[9999]" isOpen={isDrawerOpen} onClose={handleClose}>
        <DrawerContent
          initialData={initialDrawerData}
          testClassName={selectedTestClassName}
          onSubmit={handleSubmit}
          onUpdate={handleUpdate}
          isPending={isPending}
          loaderAnimation={loaderAnimation}
        />
      </Drawer>
    </>
  );
}

// DrawerContent component remains the same...
function DrawerContent({ initialData, testClassName, onSubmit, onUpdate, isPending, loaderAnimation }) {
  const [apiData, setApiData] = useState(initialData);
  const [originalApiData, setOriginalApiData] = useState(initialData);

  if (JSON.stringify(initialData) !== JSON.stringify(originalApiData)) {
    setApiData(initialData);
    setOriginalApiData(initialData);
  }

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    onSubmit(testClassName);
  };

  const handleLocalUpdate = () => {
    const overrides = {};
    Object.keys(apiData).forEach(key => {
      if (JSON.stringify(apiData[key]) !== JSON.stringify(originalApiData[key])) {
        overrides[key] = apiData[key];
      }
    });
    onUpdate(testClassName, overrides);
  };

  const handleInputChange = (key, newValue) => {
    setApiData((prev) => ({ ...prev, [key]: newValue }));
  };

  if (isPending) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm z-50">
        <Lottie animationData={loaderAnimation} loop={true} className="w-150 h-30" />
      </div>
    );
  }

  if (Object.keys(apiData).length === 0) {
    return <p className="p-4">No data available</p>;
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto p-4">
      <h2 className="font-bold text-xl mb-6">Dynamic User Details</h2>

      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleLocalSubmit}>
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
                value={value || ''}
                onChange={(e) => {
                  let newValue = e.target.value;

                  if (lowerKey.includes("pan") || lowerKey.includes("code")) {
                    newValue = newValue.toUpperCase();
                  }

                  if (inputType === "number") {
                    newValue = Number(newValue) || 0;
                  }

                  handleInputChange(key, newValue);
                }}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${lowerKey.includes("pan") || lowerKey.includes("code") ? "uppercase" : ""}`}
                placeholder={`Enter ${key.replace(/_/g, " ")}`}
              />
            </div>
          );
        })}

        <div className="sm:col-span-2 pt-2 flex justify-between gap-2">
          <button
            type="submit"
            className="w-[100px] bg-cyan-600 text-white py-2 rounded-lg hover:bg-black transition"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleLocalUpdate}
            className="w-[100px] bg-amber-500 text-white py-2 rounded-lg hover:bg-black transition"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

const Step = memo(({ header, lastDate, value, bandsData, ranges, onClick }) => {
  return (
    <div
      className="rounded-xl p-6 border text-black border-gray-300 shadow-xl transform transition-all duration-500 hover:scale-102 w-[435px] h-[300px] cursor-pointer"
      onClick={() => onClick({ header, lastDate, value })}
    >
      <h3 className="text-md font-bold mb-2 w-90">{header}</h3>
      <div className="flex justify-between items-center mt-1 h-full">
        <div className="">
          <div className="font-semibold w-[126px]">
            <span className="text-xs font-bold">Last Testing Date: </span>
            <span className="text-xs text-blue-400">{lastDate}</span>
          </div>
        </div>
        <div className="w-auto -ml-18">
          <GaugeChartStep value={value} bandsData={bandsData} ranges={ranges} />
        </div>
      </div>
    </div>
  );
});