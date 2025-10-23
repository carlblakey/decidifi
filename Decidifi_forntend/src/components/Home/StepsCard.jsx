import React from "react";
import { motion } from "framer-motion";
import { FaBookOpen, FaCheckCircle, FaUsers, FaClipboardCheck, FaChartLine, FaStar, FaPaperPlane } from "react-icons/fa"; // Import icons
import { useInView } from "framer-motion"; // Import useInView hook

const StepsCard = () => {
  const steps = [
    {
      title: "Explore the Scorecard Library",
      description: "Browse over 500 decision categories across personal, professional, and life topics.",
      icon: <FaBookOpen className="text-3xl text-blue-500" />
    },
    {
      title: "Pick Your Decision Topic",
      description: "Select from a range of topics (e.g., “choose a college”).",
      icon: <FaCheckCircle className="text-3xl text-green-500" />
    },
    {
      title: "Choose Your Scorecard",
      description: "Opt for a quick-view scorecard for fast decisions or an in-depth scorecard for detailed analysis.",
      icon: <FaClipboardCheck className="text-3xl text-yellow-500" />
    },
    {
      title: "Define Your Decision Makers",
      description: "Identify everyone involved in the decision and allocate decision-making weight.",
      icon: <FaUsers className="text-3xl text-purple-500" />
    },
    {
      title: "Set Your Criteria",
      description: "Select and adjust criteria to match what matters most.",
      icon: <FaStar className="text-3xl text-orange-500" />
    },
    {
      title: "Rate Your Options",
      description: "Using an 11-point scale, score each option against the criteria.",
      icon: <FaChartLine className="text-3xl text-teal-500" />
    },
    {
      title: "Review & Decide",
      description: "Compare the scores to see which option ranks highest.",
      icon: <FaPaperPlane className="text-3xl text-red-500" />
    }
  ];

  // Create a ref for observing the component's visibility
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true }); // Trigger animation once when visible

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-2 px-4">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          className="relative flex flex-col bg-white shadow-lg border border-slate-200 rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}} // Animate only when in view
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <div className="mx-3 mb-0 border-b border-slate-200 pt-3 pb-2 px-1 flex items-center">
            <div className="mr-2">{step.icon}</div>
            <span className="text-sm text-slate-600 font-medium">Step {index + 1}</span>
          </div>

          <div className="p-4">
            <h5 className="mb-2 text-slate-800 text-xl font-semibold">
              {step.title}
            </h5>
            <p className="text-slate-600 leading-normal font-light">
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StepsCard;