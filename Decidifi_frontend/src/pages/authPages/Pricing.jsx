import React from "react";
import { motion } from "framer-motion";
import { SubscriptionCard, Wrapper } from "../../components";

const Pricing = () => {
  const subscriptions = [
    {
      title: "Basic Plan",
      price: 10,
      features: [
        { label: "Feature 1", isIncluded: true },
        { label: "Feature 2", isIncluded: true },
        { label: "Feature 3", isIncluded: false },
      ],
    },
    {
      title: "Standard Plan",
      price: 20,
      features: [
        { label: "Feature 1", isIncluded: true },
        { label: "Feature 2", isIncluded: true },
        { label: "Feature 3", isIncluded: true },
        { label: "Feature 4", isIncluded: false },
      ],
    },
    {
      title: "Premium Plan",
      price: 30,
      features: [
        { label: "Feature 1", isIncluded: true },
        { label: "Feature 2", isIncluded: true },
        { label: "Feature 3", isIncluded: true },
        { label: "Feature 4", isIncluded: true },
        { label: "Feature 5", isIncluded: true },
      ],
    },
  ];

  return (
    <Wrapper>
      <div>
        <h2 className="text-xl font-bold tracking-tight text-center mt-12 sm:text-5xl">
          Pricing
        </h2>
        <p className="max-w-3xl mx-auto mt-4 text-xl text-center">
          Get started on our free plan and upgrade when you are ready.
        </p>
      </div>
      <motion.div
        className="mt-24 container space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {subscriptions.map((v, k) => (
          <SubscriptionCard
            key={k}
            plan={v.title}
            price={v.price}
            features={v.features}
          />
        ))}
      </motion.div>
    </Wrapper>
  );
};

export default Pricing;