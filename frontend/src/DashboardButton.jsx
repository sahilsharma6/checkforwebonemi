import { useEffect, useState } from "react";

export default function DashboardButton() {
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.name) {
          setHasUser(true);
        }
      } catch (e) {
        console.error("Invalid user in localStorage");
      }
    }
  }, []);

  if (!hasUser) return null;

  return (
    <div className="flex justify-end m-10">
      <a href="/dashboard">
        <button
          type="button"
          className="bg-[#ff6b6b] hover:bg-[#ff5a5a] text-white px-8 py-3 rounded-md shadow-lg transition-all duration-200 font-semibold text-sm border"
        >
          Dashboard
        </button>
      </a>
    </div>
  );
}
