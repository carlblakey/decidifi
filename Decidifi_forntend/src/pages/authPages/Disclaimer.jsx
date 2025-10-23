import React from "react";
import { Footer, Header } from "../../components";
import { Link } from "react-router-dom";

const Disclaimer = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col px-8">
        <div className="max-w-7xl">
          <div>
            <div
              id="welcome-section"
              className="flex mt-5 p-6 flex-col justify-center items-center "
            >
              <h1 className="text-4xl font-bold py-5 w-fit">Disclaimer</h1>
            </div>
            <div id="welcome-section" className="mt-5 p-6 w-10/12 mx-auto">
              <p className="text-base">
                Decidifi is committed to protecting the privacy and security of
                your personal and confidential information. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your data
                when you use our platform, in compliance with applicable laws
                and regulations. By accessing or using Decidifi, you agree to
                the terms of this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Disclaimer;
