import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faXmarkCircle,
  faUser,
  faLayerGroup,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";

const plans = [
  {
    title: "Mini VCard Website",
    titleSlug: "Mini-VCard-Website",
    price: "Free",
    icon: <FontAwesomeIcon icon={faUser} />,
    features: {
      "Custom Domain": false,
      Subdomain: false,
      Ecommerce: false,
      "Hotel Booking": false,
    },
    actions: ["Signup"],
  },
  {
    title: "Startup",
    titleSlug: "Startup",

    price: "₹9.99",
    icon: <FontAwesomeIcon icon={faLayerGroup} />,
    features: {
      "Custom Domain": false,
      Subdomain: false,
      Ecommerce: false,
      "Hotel Booking": false,
    },
    actions: ["Trial", "Purchase"],
  },
  {
    title: "Growth",
    titleSlug: "Growth",

    price: "₹12.99",
    icon: <FontAwesomeIcon icon={faCircleCheck} />,
    features: {
      "Custom Domain": false,
      Subdomain: true,
      Ecommerce: false,
      "Hotel Booking": false,
    },
    actions: ["Trial", "Purchase"],
  },
];

export default function PricingSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
      {plans.map((plan, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          className="pricing-card group relative flex flex-col justify-between h-full rounded-2xl bg-white shadow-md overflow-hidden transition"
        >
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-pink-100 group-hover:bg-white p-2 rounded-md text-xl transition">
                {plan.icon}
              </div>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-white transition">
                {plan.title}
              </h2>
            </div>

            <p className="text-4xl font-extrabold text-gray-900 group-hover:text-white transition mb-1">
              {plan.price}{" "}
              <span className="text-base font-medium group-hover:text-white/90">
                / month
              </span>
            </p>

            <h3 className="text-md font-semibold text-gray-800 group-hover:text-white mt-4 mb-3 transition">
              What's Included
            </h3>

            <ul className="space-y-3">
              {Object.entries(plan.features).map(([feature, available]) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <span className="text-lg">
                    {available ? (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-[#75ff6b]"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faXmarkCircle}
                        className="text-red-500 group-hover:text-white"
                      />
                    )}
                  </span>
                  <span
                    className={`transition ${
                      available
                        ? "text-gray-800 group-hover:text-white"
                        : "text-gray-400 group-hover:text-white/70"
                    }`}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button className="mt-4 text-sm text-[#FF6B6B] font-medium group-hover:text-white hover:underline transition">
              Show More +
            </button>
          </div>

          <div className="flex gap-3 p-4 border-t border-gray-100 group-hover:border-white z-10 relative">
            {plan.actions.map((action, idx) => (
              <Link to={`/register?plan=${plan.titleSlug}`}>
                <button
                  key={idx}
                  // onClick={}

                  className={`flex-1 text-sm font-semibold py-2 rounded-md transition w-[100px] ${
                    action === "Trial"
                      ? "bg-[#FF6B6B] text-white hover:bg-[#ff5656] shadow-md border border-white"
                      : "border border-[#FF6B6B] text-[#FF6B6B] group-hover:border-white group-hover:text-white hover:bg-white/10 shadow-md"
                  }`}
                >
                  {action}
                </button>
              </Link>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
