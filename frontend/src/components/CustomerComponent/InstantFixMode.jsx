import React, { useState } from "react";
import axios from "axios";

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
    video: "https://www.youtube.com/embed/8Y2cHDjWrk8",
  },
  "Washing Machine-Not Spinning": {
    text: "Could be due to an unbalanced load or a faulty lid switch.",
    video: "https://www.youtube.com/embed/Y8ZfHRbQEDk",
  },
  "Dryer-Not Heating": {
    text: "Heating element might be broken. Also check the thermal fuse.",
    video: "https://www.youtube.com/embed/JzjS4oCNRNE",
  },
  // Add more as needed
};

const InstantFixMode = () => {
  const [type, setType] = useState("");
  const [issue, setIssue] = useState("");
  const [diagnosis, setDiagnosis] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");

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
            onClick={() => alert("Technician request sent!")}
          >
            Request Technician Help
          </button>
        </div>

        {message && <p className="text-center mt-3 text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default InstantFixMode;
