import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from '../Header'; 
import Footer from '../Footer'; 

const issuesByType = {
  Refrigerator: ["Not Cooling", "Leaking Water", "Strange Noise"],
  "Washing Machine": ["Not Spinning", "Water Not Draining", "Vibrates Excessively"],
  Dryer: ["Not Heating", "Takes Too Long", "Makes Noise"],
  Dishwasher: ["Not Cleaning", "Leaking", "Bad Smell"],
  Oven: ["Not Heating", "Uneven Cooking", "Broken Door"],
  Microwave: ["No Power", "Sparks Inside", "Buttons Not Working"],
  "Air Conditioner": ["Not Cooling", "Water Leak", "Strange Smell"],
  Heater: ["No Heat", "Strange Sound", "Not Turning On"],
  "Water Heater": ["No Hot Water", "Leaking", "Strange Odor"],
  "Vacuum Cleaner": ["No Suction", "Brush Not Spinning", "Overheating"],
};

const fixTips = {
  "Refrigerator-Not Cooling": {
    text: "Check if the thermostat is set correctly. Make sure the vents aren't blocked.",
    video: "https://www.youtube.com/embed/J4FSLDQ0swY", 
  },
  "Refrigerator-Leaking Water": {
    text: "Ensure the door seal is intact and the defrost drain is clear.",
    video: "https://www.youtube.com/embed/0DcQMhwOyaY", 
  },
  "Refrigerator-Strange Noise": {
    text: "Check for any items blocking the fan or condenser coils.",
    video: "https://www.youtube.com/embed/ajZV4QikwpA", 
  },
  
  "Washing Machine-Not Spinning": {
    text: "Could be due to an unbalanced load or a faulty lid switch.",
    video: "https://www.youtube.com/embed/_fHoAjOmHDU", 
  },
  "Washing Machine-Water Not Draining": {
    text: "Check the drain hose for clogs and the pump filter.",
    video: "https://www.youtube.com/embed/WxNRAMWDY2w", 
  },
  "Washing Machine-Vibrates Excessively": {
    text: "Ensure the washer is level, and check for any imbalance in the load.",
    video: "https://www.youtube.com/embed/RcczqrA0Uqw", 
  },
  
  "Dryer-Not Heating": {
    text: "Heating element might be broken. Also check the thermal fuse.",
    video: "https://www.youtube.com/embed/S9KaJeV_bMQ", 
  },
  "Dryer-Takes Too Long": {
    text: "Check the vent for blockages, and make sure the dryer is not overloaded.",
    video: "https://www.youtube.com/embed/LomsPjO4uew", 
  },
  "Dryer-Makes Noise": {
    text: "Check for foreign objects in the drum and inspect the drum belt.",
    video: "https://www.youtube.com/embed/BqjBtF9v4o8", 
  },

  
    "Dishwasher-Not Cleaning": {
      "text": "Check if the spray arms are clogged. Ensure water pressure is sufficient.",
      "video": "https://www.youtube.com/embed/S6xzsY_6mEc"
    },
    "Dishwasher-Leaking": {
      "text": "Check the door seal and ensure that the water inlet valve is functioning.",
      "video": "https://www.youtube.com/embed/GC3ZiTR6mUw"
    },
    "Dishwasher-Bad Smell": {
      "text": "Run an empty cycle with vinegar to clean the dishwasher and check the drain for clogs.",
      "video": "https://www.youtube.com/embed/FYHCT65m-3A"
    },
    "Oven-Not Heating": {
      "text": "Ensure the heating element is intact and the oven's thermostat is working.",
      "video": "https://www.youtube.com/embed/96s7maybHlY"
    },
    "Oven-Uneven Cooking": {
      "text": "Check the oven's calibration and ensure proper airflow inside the oven.",
      "video": "https://www.youtube.com/embed/jB9SBT9gsdY"
    },
    "Oven-Broken Door": {
      "text": "Check if the door seal is damaged, and inspect the hinges for wear.",
      "video": "https://www.youtube.com/embed/OAXiVPQ1KV8"
    },
    "Microwave-No Power": {
      "text": "Check the power supply, fuse, and door switch.",
      "video": "https://www.youtube.com/embed/8i3iYtQOih4"
    },
    "Microwave-Sparks Inside": {
      "text": "Check for metal objects or foil inside the microwave, and ensure the waveguide cover is intact.",
      "video": "https://www.youtube.com/embed/60PoUf-u8Vk"
    },
    "Microwave-Buttons Not Working": {
      "text": "Try resetting the microwave or check for faulty control board connections.",
      "video": "https://www.youtube.com/embed/wRQ6yezhvXo"
    },
    "Air Conditioner-Not Cooling": {
      "text": "Check the air filter and ensure the refrigerant level is correct.",
      "video": "https://www.youtube.com/embed/Gfyk0qyAXlY"
    },
    "Air Conditioner-Water Leak": {
      "text": "Check the drainage system and ensure the filter is clean.",
      "video": "https://www.youtube.com/embed/brKBemwkRkI"
    },
    "Air Conditioner-Strange Smell": {
      "text": "Clean the filter and check for mold or mildew inside the unit.",
      "video": "https://www.youtube.com/embed/VWUJb0en-2c"
    },
    "Heater-No Heat": {
      "text": "Check the thermostat, heating elements, and circuit breakers.",
      "video": "https://www.youtube.com/embed/pJzP1jzYPqg"
    },
    "Heater-Strange Sound": {
      "text": "Check for air trapped in the system or a faulty blower motor.",
      "video": "https://www.youtube.com/embed/DhFUXwC59FU"
    },
    "Heater-Not Turning On": {
      "text": "Check the power supply and ensure the thermostat is set correctly.",
      "video": "https://www.youtube.com/embed/q7Kh2WwkSfQ"
    },
    "Water Heater-No Hot Water": {
      "text": "Check the thermostat setting and ensure the heating element is not faulty.",
      "video": "https://www.youtube.com/embed/054cRskeh5k"
    },
    "Water Heater-Leaking": {
      "text": "Check the water connections for leaks and inspect the pressure relief valve.",
      "video": "https://www.youtube.com/embed/u_MTFlN5Rjs"
    },
    "Water Heater-Strange Odor": {
      "text": "Flush the tank to remove any sediment buildup and check the anode rod.",
      "video": "https://www.youtube.com/embed/waficQobGnM"
    },
    "Vacuum Cleaner-No Suction": {
      "text": "Check the hose for clogs and the filter for cleanliness.",
      "video": "https://www.youtube.com/embed/T-LrgOQ7yjo"
    },
    "Vacuum Cleaner-Brush Not Spinning": {
      "text": "Inspect the brush for debris and check the motor or belt.",
      "video": "https://www.youtube.com/embed/t_IznrzBsJE"
    },
    "Vacuum Cleaner-Overheating": {
      "text": "Ensure the filters are clean and check the motor for overheating.",
      "video": "https://www.youtube.com/embed/VC9AKkafdN4"
    }
  
}; 

const InstantFixMode = () => {
  const [type, setType] = useState("");
  const [issue, setIssue] = useState("");
  const [diagnosis, setDiagnosis] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const navigate = useNavigate();

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setIssue("");
    setDiagnosis(null);
    setMessage("");
  };

  const handleIssueChange = (e) => {
    const selectedIssue = e.target.value;
    setIssue(selectedIssue);
    const key = `${type}-${selectedIssue}`;
    setDiagnosis(fixTips[key] || { text: "We'll need to send a technician to take a closer look." });
    setMessage("");
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setFileName(selected.name);
  };

  const handleSubmit = async () => {
    if (!type || !issue) {
      setMessage("Please select appliance type and issue.");
      return;
    }

    const formData = new FormData();
    formData.append("applianceType", type);
    formData.append("issue", issue);
    if (file) formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/instant-fix/submit", formData);
      setMessage("Fix request submitted successfully!");
      setPaymentSuccess(true);
      setShowPaymentPopup(true);
    } catch (error) {
      console.error(error);
      setMessage("Submission failed. Try again.");
      setPaymentSuccess(false);
      setShowPaymentPopup(false);
    }
  };

  const handleTechnicianRequest = () => {
    navigate("/support");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-gray-100">
      {/* Your Existing Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full bg-white/90 rounded-3xl shadow-2xl p-10 transform transition-all hover:scale-105 duration-300 border border-indigo-100 backdrop-blur-md">
          <h2 className="text-4xl font-extrabold text-indigo-800 text-center mb-2 tracking-tight drop-shadow-lg">
            Instant Fix Mode
          </h2>
          <p className="text-center text-indigo-400 mb-8 text-lg font-medium">Get quick solutions or request expert help</p>

          <div className="space-y-7">
            {/* Appliance Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span role="img" aria-label="appliance" className="mr-1">🔧</span> Appliance Type
              </label>
              <div className="relative">
                <select
                  className="w-full border border-indigo-200 rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200 shadow-sm bg-white appearance-none pr-10"
                  value={type}
                  onChange={handleTypeChange}
                >
                  <option value="">Select Type</option>
                  {Object.keys(issuesByType).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 pointer-events-none text-xl">⬇️</span>
              </div>
            </div>

            {/* Issue */}
            {type && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span role="img" aria-label="issue" className="mr-1">⚠️</span> Issue
                </label>
                <div className="relative">
                  <select
                    className="w-full border border-indigo-200 rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200 shadow-sm bg-white appearance-none pr-10"
                    value={issue}
                    onChange={handleIssueChange}
                  >
                    <option value="">Select Issue</option>
                    {issuesByType[type].map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 pointer-events-none text-xl">⬇️</span>
                </div>
              </div>
            )}

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span role="img" aria-label="upload" className="mr-1">📎</span> Upload Image/Audio
              </label>
              <div className="relative group">
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 rounded-xl p-6 cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition duration-200">
                  <span className="text-3xl text-indigo-400 mb-2">⬆️</span>
                  <span className="text-gray-500">Drag & drop or click to upload</span>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {fileName && (
                  <div className="mt-2 flex items-center gap-2">
                    {file && file.type.startsWith('image') ? (
                      <img src={URL.createObjectURL(file)} alt="preview" className="w-10 h-10 object-cover rounded shadow" />
                    ) : file && file.type.startsWith('audio') ? (
                      <span className="text-2xl">🎵</span>
                    ) : null}
                    <span className="text-sm text-gray-700 font-medium truncate max-w-xs">{fileName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Diagnosis */}
            {diagnosis && (
              <div className="bg-green-50 border-l-4 border-green-400 text-green-900 p-5 rounded-xl shadow-inner animate-fade-in flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-500 text-2xl">✅</span>
                  <strong className="text-lg font-semibold">Possible Fix:</strong>
                </div>
                <p className="ml-8 text-base">{diagnosis.text}</p>
                {diagnosis.video && (
                  <div className="mt-3 ml-8">
                    <iframe
                      width="100%"
                      height="200"
                      src={diagnosis.video}
                      title="Fix Tutorial"
                      allowFullScreen
                      className="rounded-lg shadow-md border border-green-200"
                    ></iframe>
                  </div>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-7">
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-200 flex items-center justify-center gap-2 text-lg"
              >
                <span role="img" aria-label="submit">🚀</span> Submit Fix Request
              </button>
              <button
                onClick={handleTechnicianRequest}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-200 flex items-center justify-center gap-2 text-lg"
              >
                <span role="img" aria-label="support">🛠️</span> Contact Support Center
              </button>
            </div>

            {/* Message */}
            {message && !showPaymentPopup && (
              <p
                className={`text-center text-base mt-4 font-semibold animate-fade-in ${
                  message.includes("successfully")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
            {/* Payment Success Popup */}
            {showPaymentPopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center animate-fade-in">
                  <div className="bg-green-100 rounded-full p-4 mb-4">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-green-700 mb-2">Request sent Successful!</h3>
                  <p className="text-gray-700 mb-6 text-center">Thank you for your request. Your fix request has been submitted successfully!</p>
                  <button
                    onClick={() => setShowPaymentPopup(false)}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
     
    </div>
  );
};

export default InstantFixMode;