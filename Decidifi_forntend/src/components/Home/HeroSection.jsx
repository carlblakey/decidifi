import React from "react";
import { motion } from "framer-motion";
import useTypewriter from "../../hooks/useTypeWriter";
import { Link } from "react-scroll"; // Import Link from react-scroll
import { ROUTES } from "../../constants";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const word = "Companion";
  const typedWord = useTypewriter(word, 1000);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center py-12 w-full min-h-[91vh] bg-gradient-to-b from-[#f0f4ff] to-white shadow-md px-8">
      {/* Heading with typing animation for 'Hard' */}
      <motion.h1
        className="text-6xl font-bold text-center max-w-3xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to Decidifi—Your Decision-Making Companion
        <motion.span
          className="inline-block bg-white text-primary"
          initial={{ opacity: 1 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            repeat: Infinity,
            duration: 0.8,
            ease: "easeInOut",
          }}
        ></motion.span>
      </motion.h1>

      {/* Paragraph content */}
      <motion.p
        className="text-center mt-4 tracking-wide text-xl max-w-5xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        Sometimes making the right decision feels overwhelming. That's why
        Decidifi is here to guide you through the process with structured,
        customizable scorecards that make even the most complex decisions
        manageable. Whether you're deciding on a career move, a major purchase,
        or an organizational strategy, Decidifi's scorecards help simplify your
        options, weigh important factors, and bring clarity to your choices.
      </motion.p>

      <motion.p
        className="text-center mt-4 tracking-wide text-xl max-w-5xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {/* <span className="font-bold text-2xl text-primary">Decidifi </span> */}
        Start your journey toward clearer, more confident decision-making by
        <a
          onClick={() => navigate(ROUTES.SIGNUP)}
          className="text-sky-500 hover:text-sky-600 cursor-pointer"
        >
          {" "}
          registering now.{" "}
        </a>
        Choose from a 48-hour no-obligation trial, purchase a single scorecard
        license, or subscribe for unlimited access to our full scorecard
        library.
      </motion.p>

      {/* Get Started Button */}
      {/* <Link to="welcome-section" smooth={true} duration={1000}>
        <button className="mt-6 px-8 py-3 text-lg font-semibold text-white bg-primary rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 hover:bg-opacity-90">
          Start Your Free Trial Now
        </button>
      </Link> */}

      {/* Short line at the end */}
      <div className="w-24 h-1 bg-primary mt-6"></div>
    </div>
  );
};

export default HeroSection;
