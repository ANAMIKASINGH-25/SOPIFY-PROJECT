import Link from 'next/link';
import Mybutton from '../component/Mybutton';
import React from 'react'

const Home = () => {
  return (
    <div className="font-sans text-gray-800 bg-gray-100">
      <header className="bg-slate-800 text-white px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">SOPify</h1>
        <nav className="space-x-6">
          <a href="#" className="hover:underline">Login</a>
          <a href="#" className="hover:underline">signup</a>
          <a href="#" className="hover:underline">Contact</a>
          <a href="#" className="hover:underline">aboutus</a>
        </nav>
      </header>

      <section className="flex flex-wrap p-8 bg-blue-50">
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-3xl font-semibold mb-4">Automate Your SOP Creation</h2>
          <p>SOPify is your one-stop solution to create, manage, and download structured SOPs effortlessly.</p>
        </div>
        <div className="w-full md:w-1/2 p-4">
          <video controls className="w-full rounded-lg shadow-md">
            <source src="video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      <section className="bg-white text-center p-8">
        <h2 className="text-3xl font-semibold mb-6">Why SOPify?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img
              src="https://assets-global.website-files.com/616225f979e8e45b97acbea0/63db04bd0ccab19579c15f48_ScreenShot2023-02-01at4.19.11PM_HsoBhcfCR.png"
              alt="Auto Screenshot"
              className="w-full rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Auto Screenshot & Highlights</h3>
            <p>Captures your actions and highlights them for clear step-by-step SOP generation.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img src="templatesop.jpg" alt="Templates" className="w-full rounded-md mb-4" />
            <p>Select from a range of professional SOP templates tailored to various purposes.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img src="exportoption.jpg" alt="Export Options" className="w-full rounded-md mb-4" />
            <h3 className="text-xl font-semibold mb-2">Export in Multiple Formats</h3>
            <p>Export SOPs as PDF, DOCX, PNG, or JPG – no feature limits, 100% free.</p>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 text-center p-8">
        <h2 className="text-3xl font-semibold mb-6">Meet the Team</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md w-64">
            <h3 className="text-xl font-semibold mb-2">Anamika Singh</h3>
            <p>Focus: Registration, Procedure Generation, Content Editing</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md w-64">
            <h3 className="text-xl font-semibold mb-2">Yadav Ruchi Tulsiram</h3>
            <p>Focus: Dashboard, Feedback, Exporting Tools</p>
          </div>
        </div>
      </section>

      <footer className="bg-slate-800 text-white text-center p-4">
        <p>&copy; {new Date().getFullYear()} SOPify. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Home;
