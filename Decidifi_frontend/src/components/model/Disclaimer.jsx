import { Modal } from "antd";
import React from "react";

const Disclaimer = ({ isModalOpen, handleCancel }) => {
  return (
    <>
      <Modal
        title="Disclaimer"
        open={isModalOpen}
        onOk={handleCancel}
        onCancel={handleCancel}
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
        <p className="text-base">
          The decision-making tools provided by Decidifi are intended to serve
          as a resource to help users organize and evaluate various factors in
          their decision-making process. While the tools offer a structured and
          quantitative approach, they do not encompass all possible variables or
          considerations that may be relevant to any specific decision. Users
          are advised to exercise their own discretion, judgment, and experience
          when making decisions. By using Decidifi’s tools, you acknowledge and
          agree that Decidifi is not responsible for the outcomes of any
          decisions made based on the use of its scorecards or other resources.
          Decidifi disclaims all liability for any consequences, losses, or
          damages arising from decisions or actions taken in reliance on its
          tools. The responsibility for final decision-making remains solely
          with the user.
        </p>
      </Modal>
    </>
  );
};

export default Disclaimer;
