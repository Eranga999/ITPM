import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Importing useNavigate from react-router-dom

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
    video: "https://www.youtube.com/embed/Y2J6fRr9aYw", // Example video link
  },
  "Refrigerator-Leaking Water": {
    text: "Ensure the door seal is intact and the defrost drain is clear.",
    video: "https://www.youtube.com/embed/FdALddmjxdg", // Example video link
  },
  "Refrigerator-Strange Noise": {
    text: "Check for any items blocking the fan or condenser coils.",
    video: "https://www.youtube.com/embed/F4lzFPVTTUs", // Example video link
  },
  
  "Washing Machine-Not Spinning": {
    text: "Could be due to an unbalanced load or a faulty lid switch.",
    video: "https://www.youtube.com/embed/EdZ9r8VdyVQ", // Example video link
  },
  "Washing Machine-Water Not Draining": {
    text: "Check the drain hose for clogs and the pump filter.",
    video: "https://www.youtube.com/embed/cCZt2STtZf8", // Example video link
  },
  "Washing Machine-Vibrates Excessively": {
    text: "Ensure the washer is level, and check for any imbalance in the load.",
    video: "https://www.youtube.com/embed/QEFsv06WGlI", // Example video link
  },
  
  "Dryer-Not Heating": {
    text: "Heating element might be broken. Also check the thermal fuse.",
    video: "https://www.youtube.com/embed/hfATu8kz8hE", // Example video link
  },
  "Dryer-Takes Too Long": {
    text: "Check the vent for blockages, and make sure the dryer is not overloaded.",
    video: "https://www.youtube.com/embed/yHZ8M0e_eF8", // Example video link
  },
  "Dryer-Makes Noise": {
    text: "Check for foreign objects in the drum and inspect the drum belt.",
    video: "https://www.youtube.com/embed/2PS7z9rhKZQ", // Example video link
  },

  "Dishwasher-Not Cleaning": {
    text: "Check if the spray arms are clogged. Ensure water pressure is sufficient.",
    video: "https://www.youtube.com/embed/vD3Xy4aF5Ho", // Example video link
  },
  "Dishwasher-Leaking": {
    text: "Check the door seal and ensure that the water inlet valve is functioning.",
    video: "https://www.youtube.com/embed/z8TIS2UO69k", // Example video link
  },
  "Dishwasher-Bad Smell": {
    text: "Run an empty cycle with vinegar to clean the dishwasher and check the drain for clogs.",
    video: "https://www.youtube.com/embed/Q0RcnHph0r8", // Example video link
  },

  "Oven-Not Heating": {
    text: "Ensure the heating element is intact and the oven's thermostat is working.",
    video: "https://www.youtube.com/embed/aM2jw1k08ps", // Example video link
  },
  "Oven-Uneven Cooking": {
    text: "Check the oven's calibration and ensure proper airflow inside the oven.",
    video: "https://www.youtube.com/embed/ewdVuWSB2NQ", // Example video link
  },
  "Oven-Broken Door": {
    text: "Check if the door seal is damaged, and inspect the hinges for wear.",
    video: "https://www.youtube.com/embed/kFOti3f78tM", // Example video link
  },

  "Microwave-No Power": {
    text: "Check the power supply, fuse, and door switch.",
    video: "https://www.youtube.com/embed/m6w6k9Z_rFc", // Example video link
  },
  "Microwave-Sparks Inside": {
    text: "Check for metal objects or foil inside the microwave, and ensure the waveguide cover is intact.",
    video: "https://www.youtube.com/embed/TARZn5lfBdc", // Example video link
  },
  "Microwave-Buttons Not Working": {
    text: "Try resetting the microwave or check for faulty control board connections.",
    video: "https://www.youtube.com/embed/Q3fPqdc_v70", // Example video link
  },

  "Air Conditioner-Not Cooling": {
    text: "Check the air filter and ensure the refrigerant level is correct.",
    video: "https://www.youtube.com/embed/QgL-PRRZ2NY", // Example video link
  },
  "Air Conditioner-Water Leak": {
    text: "Check the drainage system and ensure the filter is clean.",
    video: "https://www.youtube.com/embed/FuBYzmG9Wuw", // Example video link
  },
  "Air Conditioner-Strange Smell": {
    text: "Clean the filter and check for mold or mildew inside the unit.",
    video: "https://www.youtube.com/embed/2ykjd8fHjP8", // Example video link
  },

  "Heater-No Heat": {
    text: "Check the thermostat, heating elements, and circuit breakers.",
    video: "https://www.youtube.com/embed/ZVdEqLps2_A", // Example video link
  },
  "Heater-Strange Sound": {
    text: "Check for air trapped in the system or a faulty blower motor.",
    video: "https://www.youtube.com/embed/KxgdhmUvOBQ", // Example video link
  },
  "Heater-Not Turning On": {
    text: "Check the power supply and ensure the thermostat is set correctly.",
    video: "https://www.youtube.com/embed/kL39pZgDh-Q", // Example video link
  },

  "Water Heater-No Hot Water": {
    text: "Check the thermostat setting and ensure the heating element is not faulty.",
    video: "https://www.youtube.com/embed/3KjFw8hcohM", // Example video link
  },
  "Water Heater-Leaking": {
    text: "Check the water connections for leaks and inspect the pressure relief valve.",
    video: "https://www.youtube.com/embed/ZUroJwvz25Y", // Example video link
  },
  "Water Heater-Strange Odor": {
    text: "Flush the tank to remove any sediment buildup and check the anode rod.",
    video: "https://www.youtube.com/embed/F9DN6dO-0dI", // Example video link
  },

  "Vacuum Cleaner-No Suction": {
    text: "Check the hose for clogs and the filter for cleanliness.",
    video: "https://www.youtube.com/embed/L2P-TKsztdM", // Example video link
  },
  "Vacuum Cleaner-Brush Not Spinning": {
    text: "Inspect the brush for debris and check the motor or belt.",
    video: "https://www.youtube.com/embed/DpaZPtiuK58", // Example video link
  },
  "Vacuum Cleaner-Overheating": {
    text: "Ensure the filters are clean and check the motor for overheating.",
    video: "https://www.youtube.com/embed/O7oCwAt6O_M", // Example video link
  },
};

const InstantFixMode = () => {
  const [type, setType] = useState("");
  const [issue, setIssue] = useState("");
  const [diagnosis, setDiagnosis] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();  // Initialize useNavigate hook

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
    } catch (error) {
      console.error(error);
      setMessage("Submission failed. Try again.");
    }
  };

  const handleTechnicianRequest = () => {
    // Navigate to the booking-form route
    navigate("/support");
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Instant Fix Mode</h2>

      <div className="space-y-4">
        <div>
          <label className="block font-semibold">Appliance Type</label>
          <select
            className="w-full border rounded p-2"
            value={type}
            onChange={handleTypeChange}
          >
            <option value="">Select Type</option>
            {Object.keys(issuesByType).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        {type && (
          <div>
            <label className="block font-semibold">Issue</label>
            <select
              className="w-full border rounded p-2"
              value={issue}
              onChange={handleIssueChange}
            >
              <option value="">Select Issue</option>
              {issuesByType[type].map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block font-semibold">Upload Image/Audio</label>
          <input type="file" onChange={handleFileChange} />
          {fileName && <p className="text-sm text-gray-500 mt-1">Uploaded: {fileName}</p>}
        </div>

        {diagnosis && (
          <div className="bg-green-100 text-green-800 p-3 rounded mt-4">
            <strong>Possible Fix:</strong> {diagnosis.text}
            {diagnosis.video && (
              <div className="mt-3">
                <iframe
                  width="100%"
                  height="220"
                  src={diagnosis.video}
                  title="Fix Tutorial"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 mt-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Submit Fix Request
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleTechnicianRequest}  // Call the function to navigate to the booking form
          >
            contact supportcenter
          </button>
        </div>

        {message && <p className="text-center mt-3 text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default InstantFixMode;
