import React, { useEffect, useState } from "react";
import axios from "axios";
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        // Validate required keys
        if (
          parsedUser &&
          parsedUser.name &&
          parsedUser.email &&
          parsedUser.plan &&
          parsedUser.role &&
          parsedUser.createdAt
        ) {
          setUser(parsedUser);
        } else {
          console.warn("User data missing required fields:", parsedUser);
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Invalid user data in localStorage:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("/api/v1/logout", { withCredentials: true });
      setUser(null);
      localStorage.removeItem("user");

      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading user info...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-10 text-red-500">
        User not found. Please log in again.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white shadow-md p-8 rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        👤 Welcome, {user.name}
      </h1>
      <ul className="space-y-3 text-sm text-gray-700">
        <li>
          <strong>Email:</strong> {user.email}
        </li>
        <li>
          <strong>Plan:</strong> {user.plan}
        </li>
        <li>
          <strong>Role:</strong> {user.role}
        </li>
        <li>
          <strong>Created At:</strong>{" "}
          {new Date(user.createdAt).toLocaleString()}
        </li>
      </ul>
      <button
        // onClick={handleLogout}
        className="mt-6 mx-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        <a href="/">Home page</a>
      </button>
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
