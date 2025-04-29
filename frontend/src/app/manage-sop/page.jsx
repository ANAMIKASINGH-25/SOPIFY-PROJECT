import React from 'react';

const ManageSOP = () => {
  return (
    <div className="font-[Inter] bg-gray-100 text-gray-800">
      <header className="bg-blue-900 text-white px-8 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">SOPify</div>
        <nav className="flex space-x-5 font-medium">
          <a href="#" className="hover:underline">Dashboard</a>
          <a href="#" className="hover:underline">Create SOP</a>
          <a href="#" className="underline">Manage SOPs</a>
        </nav>
      </header>

      <main className="max-w-[900px] mx-auto mt-8 px-4">
        <h1 className="text-2xl font-bold mb-2">📋 Manage Your SOPs</h1>
        <p className="text-gray-500 mb-8 text-base">
          View, edit, download, or delete your existing SOPs created with the SOPify browser extension.
        </p>

        <section className="flex flex-col gap-6">
          {/* SOP Card 1 */}
          <div className="bg-white rounded-xl p-6 shadow-md flex justify-between items-center flex-wrap">
            <div>
              <h2 className="text-lg font-semibold mb-1">📦 Python Library Installation</h2>
              <p className="text-sm text-gray-700">
                <strong>Created:</strong> 2025-04-15 &nbsp;•&nbsp; 
                <strong>Status:</strong> Completed
              </p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">✏️ Edit</button>
              <button className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">🗑️ Delete</button>
              <button className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">⬇️ Download</button>
            </div>
          </div>

          {/* SOP Card 2 */}
          <div className="bg-white rounded-xl p-6 shadow-md flex justify-between items-center flex-wrap">
            <div>
              <h2 className="text-lg font-semibold mb-1">🌐 GitHub Repo Setup</h2>
              <p className="text-sm text-gray-700">
                <strong>Created:</strong> 2025-04-20 &nbsp;•&nbsp; 
                <strong>Status:</strong> Draft
              </p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">✏️ Edit</button>
              <button className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">🗑️ Delete</button>
              <button className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">⬇️ Download</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center py-4 text-sm text-gray-500 border-t mt-12">
        © 2025 SOPify Extension. All rights reserved.
      </footer>
    </div>
  );
};

export default ManageSOP;
