import { Modal } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const TermsConditions = ({ isModalOpen, handleToggleModel }) => {
  const [open, setopen] = useState(false);

  return (
    <>
      <Modal
        title="Terms and Conditions"
        open={isModalOpen}
        onOk={() => handleToggleModel("Terms")}
        onCancel={() => handleToggleModel("Terms")}
        width={"60%"}
        footer={false}
        maskClosable={false}
        style={{ top: 20 }} // Position the modal closer to the top
        styles={{
          body: {
            maxHeight: "640px", // Set a max height for the modal content
            overflowY: "auto", // Enable vertical scrolling
          },
        }}
      >
        <h3 className="font-bold text-lg my-2">1. Introduction</h3>
        <p className="text-base">
          Welcome to Decidifi, a decision-making scorecard tool platform. By
          subscribing to and using Decidifi's services, you agree to comply with
          and be bound by the following terms and conditions. These terms govern
          your use of Decidifi's tools, services, and any associated content
          provided through our subscription-based platform.
        </p>

        <h3 className="font-bold text-lg my-2 pt-5">
          2. Subscription and Licensing
        </h3>
        <p className="text-base my-2">
          <b>2.1 </b> Subscription: Decidifi offers various subscription plans,
          including but not limited to annual and trial subscriptions. By
          purchasing a subscription, you are granted a non-exclusive,
          non-transferable, and revocable license to use the decision-making
          tools available on the platform for personal or business use during
          the subscription period.
        </p>
        {/* className="bg-yellow-400" */}
        <p className="text-base my-2">
          <b>2.2 </b> License Limitations: Your license is personal to you and
          may not be shared, transferred, or sub-licensed to any third party
          unless otherwise specified. As the account holder, you may invite
          sub-users to contribute to specific decision scorecards you have
          authorized them to access. Please note that any sub-users granted
          access will have visibility into all data entered into the shared
          scorecard, including contributions made by other users. By inviting
          sub-users, you accept full responsibility for ensuring they comply
          with the terms of this agreement. Unauthorized sharing of login
          credentials or other access details will result in the immediate
          termination of your subscription without refund.
        </p>
        <p className="text-base my-2">
          <b>2.3 </b> Auto-Renewal: Your subscription will automatically renew
          at the end of the subscription period unless you opt out of
          auto-renewal before the renewal date. You will be billed according to
          the payment details provided upon initial registration. You can manage
          your renewal preferences through your account settings.
        </p>

        <h3 className="font-bold text-lg my-2 pt-5">
          3. Payment and Refund Policy
        </h3>
        <p className="text-base my-2">
          <b>3.1 </b> Payment: All subscription fees are payable in advance. You
          agree to provide accurate payment information and authorize Decidifi
          to charge your account for the applicable fees associated with your
          chosen subscription plan.
        </p>
        <p className="text-base my-2">
          <b>3.2 </b> Refunds: Subscription fees are non-refundable once paid,
          except as required by law. If you cancel your subscription, you will
          retain access to Decidifi’s platform until the end of the current
          billing cycle, after which access will be terminated.
        </p>
        <h3 className="font-bold text-lg my-2 pt-5">4. User Obligations</h3>
        <p className="text-base my-2">
          <b>4.1 </b> Account Responsibility: You are responsible for
          maintaining the confidentiality of your login information and ensuring
          that all activities that occur under your account comply with these
          terms.
        </p>
        <p className="text-base my-2">
          <b>4.2 </b>
          Appropriate Use: You agree not to use the platform in any way that is
          unlawful, harmful, or in violation of any applicable regulations.
          Decidifi reserves the right to suspend or terminate your account if
          your activities breach these terms.
        </p>
        <h3 className="font-bold text-lg my-2 pt-5">
          5. Platform Use and Restrictions
        </h3>
        <p className="text-base my-2">
          <b>5.1 </b>
          Service Availability: Decidifi endeavors to ensure that the platform
          is available 24/7. However, we do not guarantee uninterrupted service,
          and the platform may experience temporary downtime for maintenance,
          updates, or other unforeseen circumstances.
        </p>
        <p className="text-base my-2">
          <b>5.2 </b>
          Intellectual Property: All content, tools, and materials provided on
          the Decidifi platform, including but not limited to scorecards,
          software, graphics, logos, and text, are protected by intellectual
          property laws. You are prohibited from reproducing, distributing,
          modifying, or publicly displaying any of Decidifi’s proprietary
          materials without prior written consent.
        </p>
        <p className="text-base my-2">
          <b>5.3 </b>
          Use Limitations: You are permitted to use Decidifi’s decision-making
          tools for your own personal, professional, or business decision-making
          purposes. You may not use the tools for any unauthorized commercial
          use or make them available to unauthorized third parties.
        </p>
        <h3 className="font-bold text-lg my-2 pt-5">
          6. Termination and Suspension
        </h3>
        <p className="text-base my-2">
          <b>6.1 </b>
          Termination by User: You may terminate your subscription at any time
          by canceling your account through your user settings. Upon
          termination, you will lose access to all features and tools associated
          with your subscription at the end of the current billing period.
        </p>
        <p className="text-base my-2">
          <b>6.2 </b>
          Termination by Decidifi: Decidifi reserves the right to terminate or
          suspend your access to the platform for violations of these terms or
          any inappropriate use of the platform. If terminated for cause, no
          refund will be provided.
        </p>
        <h3 className="font-bold text-lg my-2 pt-5">
          7. Privacy and Data Security
        </h3>
        <p className="text-base my-2">
          <b>7.1 </b>
          Data Collection: Decidifi collects and stores personal data as
          outlined in our Privacy Policy. By using our platform, you agree to
          the collection, storage, and use of your data as described in the{" "}
          <Link
            to=""
            className="text-sky-500 hover:text-sky-600 underline"
            onClick={() => handleToggleModel("Privacy")}
          >
            Privacy Policy.
          </Link>
        </p>
        <p className="text-base my-2">
          <b>7.2 </b>
          Data Security: Decidifi takes reasonable steps to protect your data,
          but we cannot guarantee the absolute security of your information. You
          acknowledge that you provide your data at your own risk.
        </p>
        <h3 className="font-bold text-lg my-2 pt-5">
          8. Modifications to Terms and Services
        </h3>
        <p className="text-base my-2">
          <b>8.1 </b>
          Changes to Terms: Decidifi reserves the right to modify or update
          these terms and conditions at any time. You will be notified of
          significant changes, and continued use of the platform after such
          modifications will constitute acceptance of the new terms.
        </p>
        <p className="text-base my-2">
          <b>8.2 </b>
          Changes to Services: Decidifi may make improvements or changes to the
          platform, including adding or removing features, tools, or
          subscription options at any time.
        </p>
        <h3 className="font-bold text-lg my-2 pt-5">
          9. Limitation of Liability
        </h3>
        <p className="text-base my-2">
          <b>9.1 </b>
          Service Limitations: Decidifi provides decision-making tools as-is and
          does not guarantee specific outcomes or results. You acknowledge that
          the effectiveness of the tools is subject to your personal discretion
          and judgment.
        </p>
        <p className="text-base my-2">
          <b>9.2 </b>
          No Liability for Outcomes: Decidifi is not liable for any losses,
          damages, or consequences arising from decisions made using the
          platform’s scorecards or resources, as outlined in the{" "}
          <Link
            to=""
            onClick={() => handleToggleModel("Disclaimer")}
            className="text-sky-500 hover:text-sky-600 underline"
          >
            Disclaimer.
          </Link>
        </p>
        <h3 className="font-bold text-lg my-2 pt-5">10. Governing Law</h3>
        <p className="text-base my-2">
          These terms are governed by and construed in accordance with the laws
          of the state or country where Decidifi operates. Any legal disputes
          will be resolved in the appropriate courts located in that
          jurisdiction.
        </p>

        <h3 className="font-bold text-lg my-2 pt-5">11. Contact Information</h3>
        <p className="text-base my-2">
          For any questions or concerns regarding these terms and conditions,
          please contact us{" "}
          <Link
            to=""
            onClick={() => handleToggleModel("contact")}
            className="text-sky-500 hover:text-sky-600 underline"
          >
            here
          </Link>
          .
        </p>
      </Modal>
    </>
  );
};

export default TermsConditions;
