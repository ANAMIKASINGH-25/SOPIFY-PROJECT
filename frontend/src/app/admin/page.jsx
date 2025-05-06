import React from 'react';
import { motion } from 'framer-motion';

const users = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    contact: '+1 234-567-890',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    contact: '+1 987-654-321',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Akash Kumar',
    email: 'akash.kumar@example.com',
    contact: '+91 87654-32100',
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
];

const AdminDashboard = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?technology,workspace')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative z-10 max-w-6xl mx-auto p-8">
        <motion.h1
          className="text-4xl font-bold text-white text-center mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Admin Dashboard – User Records
        </motion.h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {users.map((user, idx) => (
            <motion.div
              key={idx}
              className="bg-white bg-opacity-90 p-6 rounded-2xl shadow-lg backdrop-blur-sm flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.2 }}
            >
              <img
                src={user.image}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover mb-4 shadow-md"
              />
              <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-gray-600 mt-1">{user.email}</p>
              <p className="text-gray-600">{user.contact}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
