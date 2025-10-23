import React from "react";
import { Footer, Header } from "../../components";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
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
              <h1 className="text-4xl font-bold py-5 w-fit">Privacy Policy</h1>
            </div>
            <div id="welcome-section" className=" mt-5 p-6 w-10/12 mx-auto">
              <p className="text-base">
                Decidifi is committed to protecting the privacy and security of
                your personal and confidential information. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your data
                when you use our platform, in compliance with applicable laws
                and regulations. By accessing or using Decidifi, you agree to
                the terms of this Privacy Policy.
              </p>

              <h3 className="font-bold text-lg my-2 pt-5">
                1. Information We Collect
              </h3>
              <p className="text-base">
                We may collect the following types of information:
              </p>
              <p className="text-base my-2">
                <b>1.1 </b>
                Personal Information: Information you provide when creating an
                account, such as your name, email address, and payment
                information.
              </p>
              <p className="text-base my-2">
                <b>1.2 </b> Decision Data: Information related to your use of
                decision scorecards, including inputs and preferences.
              </p>
              <p className="text-base my-2">
                <b>1.3 </b> Technical Information: Data automatically collected,
                such as IP addresses, browser types, and usage statistics,
                through cookies and similar technologies.
              </p>

              <h3 className="font-bold text-lg my-2 pt-5">
                2. How We Use Your Information
              </h3>
              <p className="text-base">We use your information to:</p>
              <p className="text-base my-2">
                <b>2.1 </b>
                Provide and improve the Decidifi platform.
              </p>
              <p className="text-base my-2">
                <b>2.2 </b> Personalize your experience based on your
                preferences and usage.
              </p>
              <p className="text-base my-2">
                <b>2.3 </b>Communicate updates, offers, and platform features.
              </p>
              <p className="text-base my-2">
                <b>2.4 </b>Ensure compliance with legal and regulatory
                obligations.
              </p>

              <h3 className="font-bold text-lg my-2 pt-5">
                3. How We Protect Your Information
              </h3>
              <p className="text-base">
                We implement appropriate technical and organizational measures
                to safeguard your data against unauthorized access, alteration,
                disclosure, or destruction, including:
              </p>
              <p className="text-base my-2">
                <b>3.1 </b>
                Encryption of sensitive information.
              </p>
              <p className="text-base my-2">
                <b>3.2 </b> Regular security audits and vulnerability
                assessments.
              </p>
              <p className="text-base my-2">
                <b>3.3 </b> Restricted access to confidential information to
                authorized personnel only.
              </p>

              <h3 className="font-bold text-lg my-2 pt-5">
                4. Sharing Your Information
              </h3>
              <p className="text-base">
                We do not sell or share your personal information with third
                parties, except:
              </p>
              <p className="text-base my-2">
                <b>4.1 </b>
                With service providers necessary to operate the platform (e.g.,
                payment processors).
              </p>
              <p className="text-base my-2">
                <b>4.2 </b> When required by law or to protect the rights and
                safety of Decidifi or its users.
              </p>
              <p className="text-base my-2">
                <b>4.3 </b> With your explicit consent.
              </p>

              <h3 className="font-bold text-lg my-2 pt-5">
                5. Your Data Rights
              </h3>
              <p className="text-base">
                You have the following rights regarding your personal
                information:
              </p>
              <p className="text-base my-2">
                <b>5.1 </b>
                Access and Correction: Request a copy of your data or update
                inaccuracies.
              </p>
              <p className="text-base my-2">
                <b>5.2 </b> Data Deletion: Request deletion of your data,
                subject to legal and operational requirements.
              </p>
              <p className="text-base my-2">
                <b>5.3 </b> Opt-Out: Unsubscribe from communications or limit
                data processing for specific purposes. To exercise these rights,
                contact us at{" "}
                <Link
                  to=""
                  className="text-sky-500 hover:text-sky-600 underline"
                >
                  ian@decidifi.com.
                </Link>
              </p>
              <h3 className="font-bold text-lg my-2 pt-5">
                6. Cookies and Tracking Technologies
              </h3>
              <p className="text-base">
                We use cookies and similar technologies to enhance your
                experience and analyze usage. You can manage cookie preferences
                through your browser settings.
              </p>
              <h3 className="font-bold text-lg my-2 pt-5">7. Data Retention</h3>
              <p className="text-base">
                We retain your data only as long as necessary to provide
                services or comply with legal obligations.
              </p>
              <h3 className="font-bold text-lg my-2 pt-5">
                8. Updates to This Privacy Policy
              </h3>
              <p className="text-base">
                We may update this Privacy Policy periodically. Changes will be
                posted on this page with an updated effective date. Continued
                use of Decidifi signifies your acceptance of the revised policy.
              </p>
              <h3 className="font-bold text-lg my-2 pt-5">9. Contact Us</h3>
              <p className="text-base">
                If you have questions about this Privacy Policy or how your data
                is handled, contact us at{" "}
                <Link
                  to=""
                  className="text-sky-500 hover:text-sky-600 underline"
                >
                  ian@decidifi.com.
                </Link>
              </p>
              <h3 className="font-bold text-lg my-2 pt-5 underline">
                Payment Processing
              </h3>
              <p className="text-base">
                I assume this is processed via a third party merchant like
                Stripe to eliminate any payment or data housing liability. Let’s
                talk about this before committing to payment options.
              </p>
              <h3 className="font-bold text-lg my-2 pt-5 underline">
                Post Registration
              </h3>
              <p className="text-base">
                Either before or immediately following the registration process,
                I envision users being prompted to choose from one of our three
                subscription options: (i) start a 48-hour no-obligation trial,
                (ii) purchase a single scorecard license for one year, or (iii)
                purchase unlimited access to our full scorecard library for one
                year. If they select the '48-hour trial' option, it will grant
                access to our scorecards for 48 hours without requirement to
                provide payment details. For the single scorecard and unlimited
                scorecard access options, they will be directed to provide
                payment information.
              </p>
              <br />
              <p className="text-base">
                Note: Registration also includes the process of adding sub-users
                to an account and limiting those sub users access to specific
                scorecards versus the whole account.
              </p>
              <br />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
