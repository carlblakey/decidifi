import React from "react";
import { motion, useInView } from "framer-motion"; // Import useInView hook
import {
  FaUsers,
  FaBriefcase,
  FaHome,
  FaPeopleArrows,
  FaHeart,
  FaMedkit,
  FaMapMarkedAlt,
  FaTrophy,
  FaBook,
  FaChalkboardTeacher,
  FaBuilding,
  FaHandshake,
  FaMoneyBillWave,
} from "react-icons/fa";

const DecisionCategories = () => {
  const categories = [
    {
      title: "Personal Decisions",
      icon: <FaUsers className="text-3xl text-blue-500 mb-2" />,
      items: [
        {
          text: "Family – Tackle important family matters with insight.",
          icon: <FaPeopleArrows className="inline-block mr-2 text-2xl" />,
        },
        {
          text: "Relationships – Weigh decisions about friendships, partnerships, and family dynamics.",
          icon: <FaHeart className="inline-block mr-2 text-2xl" />,
        },
        {
          text: "Health & Wellness – Make informed decisions about your physical and mental well-being.",
          icon: <FaMedkit className="inline-block mr-2 text-2xl" />,
        },
        {
          text: "Geography – Choose the best place to live, work, or travel.",
          icon: <FaMapMarkedAlt className="inline-block mr-2 text-2xl" />,
        },
      ],
    },
    {
      title: "Professional Decisions",
      icon: <FaBriefcase className="text-3xl text-green-500 mb-2" />,
      items: [
        {
          text: "Career – Navigate job offers, career changes, and development opportunities.",
          icon: <FaTrophy className="inline-block mr-2 text-2xl" />,
        },
        {
          text: "Workplace – Streamline decisions around team dynamics, strategy, and project selection.",
          icon: <FaBuilding className="inline-block mr-2 text-2xl" />,
        },
        {
          text: "Advisory – Choose the best experts, consultants, or mentors.",
          icon: <FaChalkboardTeacher className="inline-block mr-2 text-2xl" />,
        },
        {
          text: "Education – Select schools, courses, or further learning paths.",
          icon: <FaBook className="inline-block mr-2 text-2xl" />,
        },
      ],
    },
    {
      title: "Life Decisions",
      icon: <FaHome className="text-3xl text-yellow-500 mb-2" />,
      items: [
        {
          text: "Community – Decide how to contribute meaningfully to your community.",
          icon: <FaHandshake className="inline-block mr-2 text-2xl" />,
        },
        {
          text: "Real Estate – Simplify decisions around buying, selling, or investing in property.",
          icon: <FaMoneyBillWave className="inline-block mr-2 text-2xl" />,
        },
        {
          text: "Purchasing – Make smarter buying decisions, whether personal or for your business.",
          icon: <FaMoneyBillWave className="inline-block mr-2 text-2xl" />,
        },
      ],
    },
  ];

  // Create a ref for observing the component's visibility
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true }); // Trigger animation once when visible

  return (
    <div ref={ref} className="p-6 mt-5">
      <h2 className="text-4xl font-bold text-center mb-8">
        Decision Categories
      </h2>
      <p className="text-lg text-center text-gray-600 mb-12">
        Decidifi covers three major areas of life
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <motion.div
            key={index}
            className="flex flex-col p-6 border border-gray-300 rounded-lg shadow-md bg-white transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}} // Animate only when in view
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className="flex items-center mb-2">
              {category.icon}
              <h2 className="text-xl font-semibold ml-2">{category.title}</h2>
            </div>
            <ul className="list-disc list-inside mt-2 text-gray-700">
              {category.items.map((item, itemIndex) => (
                <li key={itemIndex} className="mb-2 flex items-center">
                  {item.icon}
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      <p className="text-lg mt-5 text-center text-gray-600">
        With Decidifi’s decision scorecards, you can easily compare your options
        and move forward with confidence.
      </p>
    </div>
  );
};

export default DecisionCategories;