"use client";
"use client";

import React, { useEffect, useState } from "react";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((newUser) => {
        setUsers((prev) => [...prev, newUser]);
        setForm({ name: "", email: "" });
      })
      .catch((err) => console.error("Error adding user:", err));
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add User
        </button>
      </form>

      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="p-3 border rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <strong>{user.name}</strong>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPage;
