import { use, useState } from "react";
// import
// get query param  react router
import { useSearchParams, useNavigate } from "react-router";

export default function RegisterForm() {
  // get query param  react router

  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // <-- for navigation

  const planParam = searchParams.get("plan");

  console.log(planParam);

  //   alert(titleSlug);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    plan: planParam,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple client-side validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(result.user)); // Save user
        alert("Registered successfully!");
        // navigate("/dashboard"); // Navigate to dashboard
        window.location.href = "http://localhost:5173/dashboard";
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <>
      <div className="text-center my-10">{planParam}</div>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-8 bg-red shadow-sm rounded-md space-y-6"
      >
        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1">
            username *
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="username"
            required
            className="w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
          />
        </div>

        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1">
            Email address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            className="w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
          />
        </div>

        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1">
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
          />
        </div>

        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1">
            Confirm Password *
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            className="w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
          />
        </div>

        <button
          type="submit"
          className="bg-[#ff6b6b] hover:bg-[#ff5a5a] text-white px-8 py-3 rounded-md shadow-lg transition-all duration-200 font-semibold text-sm"
        >
          Continue
        </button>
      </form>
    </>
  );
}
