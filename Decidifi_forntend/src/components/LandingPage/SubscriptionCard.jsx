import React from "react";
import { motion } from "framer-motion";

const SubscriptionCard = ({ plan, price, features, isPopular }) => {
  return (
    <motion.div
      className="relative p-8 border border-gray-200 rounded-2xl shadow-sm flex flex-col"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex-1">
        <h3 className="text-xl font-semibold">{plan}</h3>
        {isPopular && (
          <motion.p
            className="absolute top-0 py-1.5 px-4 bg-emerald-500 text-white rounded-full text-xs font-semibold uppercase tracking-wide transform -translate-y-1/2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Most popular
          </motion.p>
        )}
        <p className="mt-4 flex items-baseline">
          <span className="text-5xl font-extrabold tracking-tight">
            ${price}
          </span>
          <span className="ml-1 text-xl font-semibold">/month</span>
        </p>
        <p className="mt-6">You want to learn and have a personal assistant</p>
        <ul role="list" className="mt-6 space-y-6">
          {features.map((v, k) => (
            <li className="flex" key={k}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0 w-6 h-6 text-emerald-500"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span className="ml-3">{v.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <a
        className="bg-emerald-500 text-white hover:bg-emerald-600 mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium"
        href="/auth/login"
      >
        Signup for free
      </a>
    </motion.div>
  );
};

export default SubscriptionCard;
