import React from "react";
import { motion } from "framer-motion";
import useTypewriter from "../../hooks/useTypeWriter";
import { Link } from "react-scroll"; // Import Link from react-scroll

const HeroSection = () => {
  const word = "Hard";
  const typedWord = useTypewriter(word, 1000);

  return (
    <div className="flex flex-col justify-center items-center py-12 w-full min-h-[91vh] bg-gradient-to-b from-[#f0f4ff] to-white shadow-md px-8">
      {/* Heading with typing animation for 'Hard' */}
      <motion.h1
        className="text-6xl font-bold text-center max-w-3xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Decision-Making Doesn’t Have to be{" "}
        <span className="text-primary">{typedWord}</span>
        <motion.span
          className="inline-block bg-white text-primary"
          initial={{ opacity: 1 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            repeat: Infinity,
            duration: 0.8,
            ease: "easeInOut",
          }}
        >
          |
        </motion.span>
      </motion.h1>

      {/* Paragraph content */}
      <motion.p
        className="text-center mt-4 tracking-wide text-xl max-w-5xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        For generations, we’ve relied on intuition, chance, and simple tactics
        to make decisions. Whether it’s flipping a coin, playing
        rock-paper-scissors, making a pros-and-cons list, or just waiting for
        clarity, these approaches don’t always hold up to the complexity of
        today’s decisions. Modern choices demand more than quick fixes—they need
        thoughtful structure, careful analysis, and the confidence to move
        forward.
      </motion.p>

      <motion.p
        className="text-center mt-4 tracking-wide text-xl max-w-5xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <span className="font-bold text-2xl text-primary">Decidifi </span>
        Inspired by the goal of simplifying decisions, 
        Decidifi is designed to help you navigate even the most intricate
        choices. Whether you're making decisions in your personal life,
        professional career, or business, Decidifi’s intuitive tools bring
        clarity to the process. We support both binary decisions (whether to act
        or not) and multi-option decisions (choosing the best path forward after
        deciding to act). Our scorecards guide you through every step—helping
        you weigh your options, assess key factors, and make informed decisions.
        From career changes to real estate investments and beyond, Decidifi
        equips you with the confidence to stop second-guessing and start moving
        toward the best outcome.
      </motion.p>

      {/* Get Started Button */}
      <Link to="welcome-section" smooth={true} duration={1000}>
        <button className="mt-6 px-8 py-3 text-lg font-semibold text-white bg-primary rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 hover:bg-opacity-90">
          Get Started
        </button>
      </Link>

      {/* Short line at the end */}
      <div className="w-24 h-1 bg-primary mt-6"></div>
    </div>
  );
};

export default HeroSection;