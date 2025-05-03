'use client';
import React from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

const dummySOPs = [
  { id: 1, title: "Onboarding Process", description: "Steps to onboard new employees." },
  { id: 2, title: "Bug Reporting", description: "Standard method to report software bugs." },
  { id: 3, title: "Content Publishing", description: "Workflow for publishing new content." },
];

const ManageSOPPage = () => {
  const handleEdit = (id) => {
    console.log("Edit SOP with ID:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete SOP with ID:", id);
  };

  const handleAdd = () => {
    console.log("Add new SOP");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-white overflow-x-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://www.sweetprocess.com/wp-content/uploads/2023/08/how-to-write-a-standard-operating-procedure-3-1024x511.jpg"
          alt="SOPify background"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4 md:mb-0 animate-fadeIn">
            🚀 Manage Your SOPs
          </h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105"
          >
            <Plus size={20} />
            Add SOP
          </button>
        </div>

        {/* SOP Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummySOPs.map((sop) => (
            <div
              key={sop.id}
              className="bg-white shadow-xl rounded-3xl p-6 flex flex-col justify-between h-full hover:shadow-2xl transition-all relative overflow-hidden group"
            >
              {/* Illustration */}
              <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <img
                  src={`/images/sopify-${sop.id}.svg`}
                  alt={`${sop.title} Illustration`}
                  className="w-32 h-32 object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">{sop.title}</h2>
                <p className="text-sm text-gray-600">{sop.description}</p>
              </div>
              <div className="flex justify-end mt-6 gap-4">
                <button
                  onClick={() => handleEdit(sop.id)}
                  className="text-blue-600 hover:text-blue-800 transition-transform hover:scale-110"
                  title="Edit"
                >
                  <Pencil size={24} />
                </button>
                <button
                  onClick={() => handleDelete(sop.id)}
                  className="text-red-600 hover:text-red-800 transition-transform hover:scale-110"
                  title="Delete"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center animate-fadeIn">
          <p className="text-gray-600 text-sm italic">
            SOPify – Simplifying your Standard Operating Procedures, one step at a time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageSOPPage;
