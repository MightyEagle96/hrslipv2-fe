import { useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

import "./App.css";

function App() {
  const [centreId, setCentreId] = useState("");
  const [loading, setLoading] = useState(false);

  const url = import.meta.env.PROD
    ? "https://hrslip.onrender.com/api/exam-slips"
    : `http://localhost:3000/api/exam-slips`;

  const generatePDF = async () => {
    if (!centreId.trim()) {
      alert("Please enter a centre ID.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/api/exam-slips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          centreId,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to generate PDF.");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `Centre-${centreId}-Exam-Slips.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center text-slate-800">
          Examination Slip Generator
        </h1>

        <p className="text-center text-slate-500 mt-3 mb-8">
          Generate all examination slips for a CBT Centre.
        </p>

        <input
          type="text"
          placeholder="Enter Centre ID"
          value={centreId}
          onChange={(e) => setCentreId(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={generatePDF}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:bg-gray-400"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <ArrowPathIcon className="w-5 h-5 animate-spin" />
              Generating PDF...
            </span>
          ) : (
            "Generate PDF"
          )}
        </button>
      </div>
    </div>
  );
}

export default App;
