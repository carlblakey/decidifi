import React from "react";
import { FaHandsHelping, FaCoffee, FaStar } from "react-icons/fa";
import SubscriptionModal from "./SubscriptionModal";
import { motion } from "framer-motion"; // Import motion for animations
import { useInView } from "framer-motion"; // Import useInView for visibility detection

const DecisionMakingTool = () => {
  // Create refs for observing the component's visibility
  const subscriptionRef = React.useRef(null);
  const infoCardRef = React.useRef(null);
  const isSubscriptionInView = useInView(subscriptionRef, { once: true });
  const isInfoCardInView = useInView(infoCardRef, { once: true });

  return (
    <div className="p-6 mt-5">
      <h2 className="text-4xl font-bold text-center mb-8">
        Affordable Decision-Making Tools
      </h2>
      <p className="text-lg text-center text-gray-600 mb-12">
        Decidifi offers flexible pricing to suit your needs:
      </p>

      {/* Combined Subscription Card */}
      <div className="flex justify-center mb-10" ref={subscriptionRef}>
        <motion.div
          className="relative flex flex-col bg-white shadow-lg border border-slate-200 rounded-lg w-full max-w-4xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isSubscriptionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4">
            <h5 className="text-xl font-semibold text-slate-800">
              Choose Your Plan
            </h5>
            <p className="text-sm text-slate-600 mt-2">
              Decidifi offers two paid subscription plans to suit your needs:
            </p>
          </div>

          {/* Single Scorecard Access */}
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <div>
              <h5 className="text-lg font-semibold text-slate-800">
                Single Scorecard Access
              </h5>
              <p className="text-sm text-slate-600 mt-2">
                Access to one scorecard for $9.99.
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-slate-800">$9.99</span>
            </div>
          </div>

          {/* Unlimited Access */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h5 className="text-lg font-semibold text-slate-800">
                Unlimited Access
              </h5>
              <p className="text-sm text-slate-600 mt-2">
                Unlimited access to over 500 scorecards annually.
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-slate-800">$49.99</span>
            </div>
          </div>

          {/* Subscribe Button */}
          <button
            className="mt-6 bg-primary text-white px-4 py-2 rounded-md"
            onClick={() => document.getElementById("my_modal_5").showModal()}
          >
            Subscribe Now
          </button>
        </motion.div>
      </div>

      <SubscriptionModal />

      <p className="text-lg mt-5 text-center text-gray-600">
        Both options come with a one-year subscription and the ability to
        unsubscribe at any time.
      </p>

      {/* Additional Information Cards */}
      <div className="flex flex-wrap justify-center gap-6 my-10">
        {/* Giving Back Card */}
        <motion.div
          className="flex flex-col bg-white shadow-md border border-slate-200 rounded-lg w-80 p-6"
          ref={infoCardRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInfoCardInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center">
            <FaHandsHelping className="text-green-500 text-2xl mr-3" />
            <h3 className="text-lg font-semibold">Giving Back</h3>
          </div>
          <p className="text-gray-600 mt-2">
            20% of all subscription revenue goes to Harbor Point, providing
            vital services like food distribution, housing assistance, and more.
          </p>
        </motion.div>

        {/* Still Not Sure Card */}
        <motion.div
          className="flex flex-col bg-white shadow-md border border-slate-200 rounded-lg w-80 p-6"
          ref={infoCardRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInfoCardInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center">
            <FaCoffee className="text-yellow-500 text-2xl mr-3" />
            <h3 className="text-lg font-semibold">Still Not Sure?</h3>
          </div>
          <p className="text-gray-600 mt-2">
            For less than a week’s worth of coffee, you can simplify your most
            important life and work decisions.
          </p>
        </motion.div>
      </div>

      {/* Ready to Start Card */}
      <motion.div
        className="flex justify-center mb-10 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={isInfoCardInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col bg-white shadow-md border border-slate-200 rounded-lg w-80 p-6">
          <div className="flex items-center">
            <FaStar className="text-blue-500 text-2xl mr-3" />
            <h3 className="text-lg font-semibold">Ready to Start?</h3>
          </div>
          <p className="text-gray-600 mt-2">
            Join Decidifi today for a 48-hour free trial or subscribe for
            unlimited access. Let’s make decision-making simpler and more
            effective—together.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DecisionMakingTool;