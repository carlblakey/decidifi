import React from "react";
import { motion } from "framer-motion";
import { 
  FaRegLightbulb, 
  FaBalanceScale, 
  FaChartBar, 
  FaCogs, 
  FaClock, 
  FaUsers, 
  FaSyncAlt, 
  FaHandshake, 
  FaTrophy 
} from "react-icons/fa"; // Import icons
import { useInView } from "framer-motion"; // Import useInView hook

const WhyUseDecidifi = () => {
  const reasons = [
    {
      title: "Clarifies Your Choices",
      description: "Organizes your options for easy comparison.",
      icon: <FaRegLightbulb className="text-3xl text-blue-500" />,
    },
    {
      title: "Weighs Key Factors",
      description: "Focuses your attention on what matters most.",
      icon: <FaBalanceScale className="text-3xl text-green-500" />,
    },
    {
      title: "Minimizes Bias",
      description: "Encourages objective, data-driven decisions.",
      icon: <FaChartBar className="text-3xl text-purple-500" />,
    },
    {
      title: "Simplifies Complex Choices",
      description: "Breaks down big decisions into manageable steps.",
      icon: <FaCogs className="text-3xl text-yellow-500" />,
    },
    {
      title: "Builds Confidence",
      description: "Provides a structured framework, so you feel secure in your choice.",
      icon: <FaTrophy className="text-3xl text-red-500" />,
    },
    {
      title: "Saves Time",
      description: "Speeds up decision-making without sacrificing quality.",
      icon: <FaClock className="text-3xl text-teal-500" />,
    },
    {
      title: "Supports Group Decisions",
      description: "Facilitates collaborative analysis, ensuring all voices are heard.",
      icon: <FaUsers className="text-3xl text-pink-500" />,
    },
    {
      title: "Ensures Consistency",
      description: "Creates a repeatable process for a variety of decisions.",
      icon: <FaSyncAlt className="text-3xl text-indigo-500" />,
    },
    {
      title: "Highlights Trade-offs",
      description: "Helps you weigh compromises and make better-informed choices.",
      icon: <FaHandshake className="text-3xl text-orange-500" />,
    },
  ];

  // Create a ref for observing the component's visibility
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true }); // Trigger animation once when visible

  return (
    <div ref={ref} className="p-6 mt-5">
      <h2 className="text-4xl font-bold text-center mb-8">Why Use Decidifi?</h2>
      <p className="text-lg text-center text-gray-600 mb-12">
        Here are just a few ways Decidifi can improve your decision-making process:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {reasons.map((reason, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center p-6 border border-gray-300 rounded-lg shadow-md bg-white transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}} // Animate only when in view
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className="mb-4">{reason.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">{reason.title}</h3>
            <p className="text-gray-600 text-center">{reason.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WhyUseDecidifi;