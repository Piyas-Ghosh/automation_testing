import { useState, useCallback, memo, useEffect } from "react";
import GaugeChartStep from "./chart/chartTest";
import Drawer from "../components/Drawer";
import api from "../api/axios";
import toast from "react-hot-toast";
import loaderAnimation from "../assets/Live chatbot.json";
import Lottie from "lottie-react";
import { useTransition } from "react";
import loader from "../assets/AI-loader.gif";

export default function TestFlow() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedTestClassName, setSelectedTestClassName] = useState("");
  const [initialDrawerData, setInitialDrawerData] = useState({});
  const [stepData, setStepData] = useState([]);

  const bandsData = [
    { title: "Good", color: "#51c251", lowScore: 0, highScore: 10 },
    { title: "Moderate", color: "#c9b74f", lowScore: 11, highScore: 20 },
    { title: "Poor", color: "#d15c5a", lowScore: 21, highScore: 30 },
  ];

  const initializeStepData = () => [
    { header: "O2C Goods Invoice Flow Test", lastDate: "2025-10-23", value: 0 },
    { header: "O2C Goods Flow Test", lastDate: "2025-09-07", value: 0 },
    { header: "O2C Service Flow Test", lastDate: "2025-09-07", value: 0 },
    { header: "Goods Direct Invoice Collection", lastDate: "2025-09-07", value: 0 },
    { header: "Proforma Goods Invoice Flow Test", lastDate: "2025-09-07", value: 0 },
    { header: "Proforma O2C Goods Flow Test", lastDate: "2025-09-07", value: 0 },
    { header: "Proforma O2C Service Flow Test", lastDate: "2025-09-07", value: 0 },
    { header: "Service Direct Invoice Collection", lastDate: "2025-09-07", value: 0 },
    { header: "Trading O2C Procurement Flow Test", lastDate: "2025-09-07", value: 0 },
    { header: "Create Customer With Gst Test", lastDate: "2025-09-07", value: 0 },
    { header: "Create Customer With Non Gst Test", lastDate: "2025-09-07", value: 0 },
    { header: "Create Vendor With Gst Test", lastDate: "2025-09-07", value: 0 },
    { header: "Create Vendor With NonGst Test", lastDate: "2025-09-07", value: 0 },
    { header: "Create Assets Test", lastDate: "2025-09-07", value: 0 },
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

      const failRate = response.data.failRate || 0;
      const testingDate = response.data.testingDate || null;
      setStepData(prevStepData =>
        prevStepData.map(step =>
          step.header === header
            ? {
              ...step,
              value: Math.round(failRate),
              lastDate: testingDate || step.lastDate,
            }
            : step
        )
      );
    } catch (error) {
      console.error(`Error fetching test graph data for ${header}:`, error);
    }
  }, []);

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

    startTransition(async () => {
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
    });
  };


  const handleUpdate = useCallback(async (testClassName, overrides) => {
    if (!testClassName) {
      toast.error("No test flow selected.");
      return;
    }

    // Normalize overrides keys to match dbConfig (e.g., customer.gstnumber -> customer.gstNumber)
    const normalizedOverrides = Object.fromEntries(
      Object.entries(overrides).map(([key, value]) => [
        key.replace("gstnumber", "gstNumber"),
        value,
      ])
    );

    const payload = { testClassName, ...normalizedOverrides };

    startTransition(async () => {
      try {
        const response = await api.post("automation/load-data", payload);
        const dbConfig = response.data.dbConfig;
        const overridesResponse = response.data.overrides || {};

        // Normalize overridesResponse keys ..............
        const normalizedOverridesResponse = Object.fromEntries(
          Object.entries(overridesResponse).map(([key, value]) => [
            key.replace("gstnumber", "gstNumber"),
            value,
          ])
        );

        // Merge dbConfig and normalized overrides, ensuring overrides take precedence
        const mergedData = { ...dbConfig, ...normalizedOverridesResponse };

        const formattedData = Object.fromEntries(
          Object.entries(mergedData).map(([key, value]) => {
            if (key.toLowerCase().includes("date") && value && typeof value === "string") {
              const parts = value.split("-");
              if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
                const [day, month, year] = parts;
                return [key, `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`];
              }
            }
            return [key, value];
          })
        );

        setInitialDrawerData(formattedData);
        toast.success("Updated successfully!");
      } catch (error) {
        console.error("Error updating data:", error);
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

        // If the step is "Create Customer With GST Test", ensure GST field is present
        if (stepData.header === "Create Customer With GST Test") {
          formattedData['customer.gstNumber'] = formattedData['customer.gstNumber'] || "";
        } else if (stepData.header === "Create Vendor With GST Test") {
          formattedData['gstNo'] = formattedData['gstNo'] || "";
        }

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
        {/* <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-4">Test Flow Visualization</h2>
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-15 gap-y-8 mt-2 animate-fade-in justify-center place-items-center">
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

function DrawerContent({ initialData, testClassName, onSubmit, onUpdate, isPending }) {
  const [apiData, setApiData] = useState(initialData);
  const [originalApiData, setOriginalApiData] = useState(initialData);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setApiData(initialData);
    setOriginalApiData(initialData);
    setIsDirty(false);
  }, [initialData]);

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    onSubmit(testClassName);
  };

  const handleLocalUpdate = () => {
    const overrides = {};
    Object.keys(apiData).forEach((key) => {
      if (JSON.stringify(apiData[key]) !== JSON.stringify(originalApiData[key])) {
        overrides[key] = apiData[key];
      }
    });
    if (Object.keys(overrides).length > 0) {
      onUpdate(testClassName, overrides);
      setIsDirty(false);
    }
  };

  const handleInputChange = (key, newValue) => {
    setApiData((prev) => {
      const updated = { ...prev, [key]: newValue };
      const dirty = Object.keys(updated).some(
        k => JSON.stringify(updated[k]) !== JSON.stringify(originalApiData[k])
      );
      setIsDirty(dirty);
      return updated;
    });
  };

  if (isPending) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm z-50">
        <img src={loader} alt="Loading..." className="w-80 h-40 object-contain" />
      </div>
    );
  }

  if (Object.keys(apiData).length === 0) {
    return <p className="text-center p-4">No data available</p>;
  }

  const isGSTTest = testClassName === "CreateCustomerWithGstTest" || testClassName === "CreateVendorWithGstTest";

  return (
    <div className="max-h-[90vh] overflow-y-auto p-4">
      <div className="flex justify-between sticky top-[-17px]  p-2  bg-white">
        <h2 className="font-bold text-xl mb-6">{testClassName} Form</h2>
        <button
          type="submit"
          onClick={handleLocalSubmit}
          disabled={isDirty}
          className={`w-[150px] h-[40px] ${isDirty ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-950 hover:bg-blue-900 cursor-pointer'} text-white py-2 rounded-lg transition font-semibold`}
        >
          Run Test Flow
        </button>
      </div>

      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleLocalSubmit}>
        {Object.entries(apiData).map(([key, value]) => {
          const lowerKey = key.toLowerCase();
          let inputType = "text";
          if (typeof value === "number") inputType = "number";
          else if (lowerKey.includes("email") || lowerKey.includes("gmail")) inputType = "email";
          else if (lowerKey.includes("phone") || lowerKey.includes("mobile")) inputType = "tel";
          else if (lowerKey.includes("date")) inputType = "date";
          else if (lowerKey.includes("gst")) inputType = "text";

          return (
            <div key={key} className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key.replace(/_/g, " ")}
              </label>
              <input
                type={inputType}
                value={value || ""}
                onChange={(e) => {
                  let newValue = e.target.value;
                  if (lowerKey.includes("pan") || lowerKey.includes("gst") || lowerKey.includes("code")) {
                    newValue = newValue.toUpperCase();
                  }
                  if (inputType === "number") {
                    newValue = Number(newValue) || 0;
                  }
                  handleInputChange(key, newValue);
                }}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${lowerKey.includes("pan") || lowerKey.includes("gst") || lowerKey.includes("code") ? "uppercase" : ""}`}
                placeholder={`Enter ${key.replace(/_/g, " ")}`}
              />
              {isGSTTest && lowerKey.includes("gst") && (
                <p className="mt-1 text-sm text-red-600">
                  Please use your own GST number, update, and then submit.
                </p>
              )}
            </div>
          );
        })}

        <div className="sm:col-span-2 pt-2 flex justify-between gap-2">
          <button
            type="button"
            onClick={handleLocalUpdate}
            disabled={!isDirty}
            className={`w-[100px] ${isDirty ? 'bg-gradient-to-r from-blue-900 to-blue-500 hover:from-blue-500 hover:to-blue-800 text-white cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}
             text-white font-semibold py-2 rounded-lg transition`}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

const Step = memo(({ header, lastDate, value, bandsData, ranges, onClick }) => {

  const calculateDaysDifference = (lastDate) => {
    const today = new Date();
    const lastTestingDate = new Date(lastDate);
    const timeDifference = today.getTime() - lastTestingDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
  }

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
          <div className=" mt-10 ">
            <h1 className={`text-lg font-bold mt-2 ${calculateDaysDifference(lastDate) > 5 ? "text-red-600" : "text-green-600"} `}>
              {calculateDaysDifference(lastDate)} Days
            </h1>
          </div>
        </div>
        <div className="w-auto -ml-18">
          <GaugeChartStep value={value} bandsData={bandsData} ranges={ranges} />
        </div>
      </div>
    </div>
  );
});