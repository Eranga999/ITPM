import { useState, useEffect } from "react";
import Header from "../Header";
import Footer from "../footer";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const RepairTrackingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("name"); // New state to track search field
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("http://localhost:5000/api/bookings");
        console.log("Bookings fetched:", response.data);
        const data = response.data.data || response.data;
        if (!Array.isArray(data)) {
          throw new Error("Fetched bookings data is not an array");
        }
        setBookings(data);
        setFilteredBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to fetch bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Handle search by selected field
  const handleSearchChange = (e) => {
    const value = e.target.value.trim();
    setSearchTerm(value);

    if (value === "") {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter((booking) => {
        const lowerSearchTerm = value.toLowerCase();
        if (searchField === "name") {
          const firstName = booking.name ? booking.name.split(" ")[0].toLowerCase() : "";
          return firstName.includes(lowerSearchTerm);
        } else if (searchField === "appliance") {
          const applianceType = booking.serviceType ? booking.serviceType.toLowerCase() : "";
          return applianceType.includes(lowerSearchTerm);
        } else if (searchField === "orderNumber") {
          const orderNumber = booking.orderNumber || booking.bookingReference || `rep-${booking._id?.substring(0, 8) || "n/a"}`;
          return orderNumber.toLowerCase().includes(lowerSearchTerm);
        }
        return false;
      });
      setFilteredBookings(filtered);
    }
  };

  // Handle search field change
  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
    setSearchTerm(""); // Reset search term when field changes
    setFilteredBookings(bookings); // Reset filtered bookings
  };

  // Calculate the current step based on status
  const getCurrentStatus = (status) => {
    switch (status) {
      case "pending":
        return { step: 1, text: "Request Received" };
      case "diagnosis":
        return { step: 2, text: "Diagnosis Complete" };
      case "in_progress":
        return { step: 3, text: "Repair in Progress" };
      case "completed":
        return { step: 4, text: "Repair Completed" };
      default:
        return { step: 1, text: "Request Received" };
    }
  };

  // Function to generate and download PDF report
  const generateReport = () => {
    try {
      console.log("Generate Report triggered");
      console.log("Filtered Bookings:", filteredBookings);

      if (!filteredBookings || filteredBookings.length === 0) {
        alert("No bookings available to generate a report.");
        return;
      }

      const doc = new jsPDF();
      console.log("jsPDF instance created");

      // Add header
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 102, 204);
      doc.text("Repair Service Report", 105, 20, { align: "center" });

      // Add "Generated for" and date
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      const generatedFor = searchTerm
        ? `Filtered by ${searchField === "name" ? "First Name" : searchField === "appliance" ? "Appliance Type" : "Order Number"}: ${searchTerm}`
        : "All Customers";
      doc.text(`Generated for: ${generatedFor}`, 14, 30);
      const currentDate = new Date().toLocaleDateString();
      doc.text(`Date: ${currentDate}`, 14, 40);

      // Define table columns and data
      const tableColumn = [
        "Order Number",
        "Name",
        "Appliance",
        "Scheduled Date",
        "Est. Completion",
        "Technician",
        "Status",
      ];

      const tableRows = filteredBookings.map((booking) => {
        if (!booking) {
          throw new Error("Invalid booking data found");
        }
        const orderNumber = booking.orderNumber || booking.bookingReference || `REP-${booking._id?.substring(0, 8) || "N/A"}`;
        return [
          orderNumber,
          booking.name || "N/A",
          booking.serviceType === "refrigerator"
            ? " Refrigerator"
            : (booking.serviceType || "N/A").replace(/-/g, " "),
          booking.preferredDate
            ? new Date(booking.preferredDate).toISOString().split("T")[0]
            : "N/A",
          booking.estimatedCompletion
            ? new Date(booking.estimatedCompletion).toISOString().split("T")[0]
            : booking.preferredDate
            ? new Date(new Date(booking.preferredDate).getTime() + 86400000)
                .toISOString()
                .split("T")[0]
            : "N/A",
          booking.technician || booking.technicianAssigned || "Not assigned yet",
          getCurrentStatus(booking.status).text,
        ];
      });

      console.log("Table rows prepared:", tableRows);

      // Generate table using autoTable
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [0, 102, 204],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          halign: "left",
        },
        alternateRowStyles: {
          fillColor: [240, 248, 255],
        },
        columnStyles: {
          0: { halign: "center" },
          1: { halign: "left" },
          2: { halign: "left" },
          3: { halign: "center" },
          4: { halign: "center" },
          5: { halign: "left" },
          6: { halign: "center" },
        },
        margin: { top: 50 },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(
              `Page ${i} of ${pageCount}`,
              data.settings.margin.left,
              doc.internal.pageSize.height - 10
            );
          }
        },
      });

      console.log("Table generated, downloading PDF...");
      const fileName = searchTerm
        ? `repair_report_${searchField}_${searchTerm}_${currentDate}.pdf`
        : `repair_report_all_${currentDate}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error("Error generating report:", err);
      alert("Failed to generate report: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Track Your Repair Header */}
          <div className="bg-blue-600 text-white p-6 rounded-t-lg">
            <h1 className="text-2xl font-bold">Track Your Repair</h1>
            <p className="text-blue-100 text-sm mt-1">
              Monitor the status of your repair service
            </p>
          </div>

          {/* Search Bar and Report Button */}
          <div className="bg-white p-4 shadow-md">
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="flex items-center gap-2 flex-grow">
                <select
                  value={searchField}
                  onChange={handleSearchFieldChange}
                  className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="name">First Name</option>
                  <option value="appliance">Appliance Type</option>
                  <option value="orderNumber">Order Number</option>
                </select>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder={`Search by ${searchField === "name" ? "first name" : searchField === "appliance" ? "appliance type" : "order number"}...`}
                  className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={generateReport}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Generate Report
              </button>
            </div>

            {error && (
              <div className="mt-3 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                {error}
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center mt-6">
              <p>Loading bookings...</p>
            </div>
          )}

          {/* No Bookings Found */}
          {!loading && filteredBookings.length === 0 && (
            <div className="text-center mt-6">
              <h2 className="text-xl font-bold text-gray-900">
                No Bookings Found
              </h2>
              <p className="mt-2 text-gray-600">
                {searchTerm
                  ? `No bookings match your search for "${searchTerm}" in ${searchField === "name" ? "first name" : searchField === "appliance" ? "appliance type" : "order number"}.`
                  : "There are no bookings available."}
              </p>
            </div>
          )}

          {/* Booking Cards */}
          {!loading &&
            filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="mt-6 bg-white p-4 shadow-md rounded-lg"
              >
                {/* Repair Details */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">Repair Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Order Number</p>
                      <p className="font-medium">
                        {booking.orderNumber || booking.bookingReference || `REP-${booking._id?.substring(0, 8) || "N/A"}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customer Name</p>
                      <p className="font-medium">{booking.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Appliance</p>
                      <p className="font-medium capitalize">
                        {booking.serviceType === "refrigerator"
                          ? "Samsung Refrigerator"
                          : (booking.serviceType || "N/A").replace(/-/g, " ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Scheduled Date</p>
                      <p className="font-medium">
                        {booking.preferredDate
                          ? new Date(booking.preferredDate)
                              .toISOString()
                              .split("T")[0]
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Estimated Completion
                      </p>
                      <p className="font-medium">
                        {booking.estimatedCompletion
                          ? new Date(booking.estimatedCompletion)
                              .toISOString()
                              .split("T")[0]
                          : booking.preferredDate
                          ? new Date(
                              new Date(booking.preferredDate).getTime() +
                                86400000
                            )
                              .toISOString()
                              .split("T")[0]
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Technician</p>
                      <p className="font-medium">
                        {booking.technician || booking.technicianAssigned || "Not assigned yet"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Repair Status */}
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-4">Repair Status</h2>
                  <div className="space-y-6">
                    {/* Status Step 1: Request Received */}
                    <div className="flex items-center">
                      <div
                        className={`rounded-full w-10 h-10 flex items-center justify-center mr-3 ${
                          getCurrentStatus(booking.status).step >= 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Request Received</h3>
                        <p className="text-sm text-gray-600">
                          Your repair request has been received and is being
                          processed
                        </p>
                      </div>
                    </div>

                    {/* Status Step 2: Diagnosis Complete */}
                    <div className="flex items-center">
                      <div
                        className={`rounded-full w-10 h-10 flex items-center justify-center mr-3 ${
                          getCurrentStatus(booking.status).step >= 2
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Diagnosis Complete</h3>
                        <p className="text-sm text-gray-600">
                          Our technician has diagnosed the issue
                        </p>
                      </div>
                    </div>

                    {/* Status Step 3: Repair in Progress */}
                    <div className="flex items-center">
                      <div
                        className={`rounded-full w-10 h-10 flex items-center justify-center mr-3 ${
                          getCurrentStatus(booking.status).step >= 3
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Repair in Progress</h3>
                        <p className="text-sm text-gray-600">
                          Repairs are currently being performed
                        </p>
                      </div>
                    </div>

                    {/* Status Step 4: Repair Completed */}
                    <div className="flex items-center">
                      <div
                        className={`rounded-full w-10 h-10 flex items-center justify-center mr-3 ${
                          getCurrentStatus(booking.status).step >= 4
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Repair Completed</h3>
                        <p className="text-sm text-gray-600">
                          Your appliance has been repaired and tested
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RepairTrackingPage;