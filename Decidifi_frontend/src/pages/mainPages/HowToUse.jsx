import React from "react";
import { Collapse } from "antd";
import { DashboardLayout } from "../../components";

const { Panel } = Collapse;

const HowToUse = () => {
  const scorecards = [
    {
      question: "How to Create a Quick-View Scorecard?",
      answer: (
        <ul className="instruction-list" style={{ listStyleType: "disc" }}>
          <li>
            <strong>Start a Decision:</strong> Click ‘Make a Decision.’
          </li>
          <li>
            <strong>Select a Category:</strong> Choose a Decision Category
            (e.g., Life), then a Sub-Category (e.g., Education), and finally a
            Scorecard Title (e.g., Which College to Attend?).
          </li>
          <li>
            <strong>Quick-View or In-Depth:</strong> Select a Quick-View
            Scorecard for fast insights.
          </li>
          <li>
            <strong>Add Decision Makers:</strong> Indicate if you’ll add other
            decision makers.
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              <li>No: You’ll be the sole decision maker.</li>
              <li>
                Yes: Add contributors and assign contribution percentages (total
                must equal 100%).
              </li>
            </ul>
          </li>
          <li>
            <strong>Customize Weighting:</strong> Enter weighting percentages
            for each contributor for every criterion. (Total for each
            contributor must equal 100%.)
          </li>
          <li>
            <strong>Add Categories and Criteria (optional):</strong> Expand
            beyond the 12 provided categories by adding new ones, each with a
            single criterion.
          </li>
          <li>
            <strong>Name Options:</strong> For binary decisions (e.g., Whether
            to Attend College), name the existing option. For multi-option
            decisions (e.g., Which College to Attend), click ‘Add Option’ and
            name each choice.
          </li>
          <li>
            <strong>Rate Options:</strong> Contributors use an 11-point scale (0
            = absolutely not aligned, 10 = perfect) to evaluate each option
            against the criteria.
          </li>
          <li>
            <strong>Reveal Results:</strong> Click ‘Show Results’ to see your
            options ranked from best to worst.
          </li>
        </ul>
      ),
    },
    {
      question: "How to Create an In-Depth Scorecard?",
      answer: (
        <ul className="instruction-list" style={{ listStyleType: "disc" }}>
          <li><strong>Start a Decision:</strong> Click ‘Make a Decision.’</li>
          <li>
            <strong>Select a Category:</strong> Choose a Decision Category (e.g., Life), then a
            Sub-Category (e.g., Education), and finally a Scorecard Title (e.g.,
            Which College to Attend?).
          </li>
          <li>
            <strong>Quick-View or In-Depth:</strong> Select an In-Depth Scorecard for detailed
            analysis.
          </li>
          <li>
            <strong>Add Decision Makers: </strong>Indicate if you’ll add other decision makers.
          </li>
          <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
            <li>No: You’ll be the sole decision maker.</li>
            <li>
              Yes: Add contributors and assign contribution percentages (total
              must equal 100%).
            </li>
          </ul>
          <li>
            <strong>Customize Weighting:</strong> Enter weighting percentages for each
            contributor for every criterion. (Total for each contributor must
            equal 100%.)
          </li>
          <li>
            <strong>Add Categories or Criteria (Optional):</strong> Expand beyond the 12 provided
            categories by adding new ones, each with multiple criteria.
          </li>
          <li>
            <strong>Name Options:</strong> For binary decisions (e.g., Whether to Attend
            College), name the existing option. For multi-option decisions
            (e.g., Which College to Attend), click ‘Add Option’ and name each
            choice (e.g., Harvard, Stanford, UCLA, etc.).
          </li>
          <li>
            <strong>Rate Options:</strong> Contributors use an 11-point scale (0 = absolutely not
            aligned, 10 = perfect) to evaluate each option against the criteria.
          </li>
          <li>
            <strong>Reveal Results:</strong> Click ‘Show Results’ to see your options ranked from
            best to worst.
          </li>
        </ul>
      ),
    },
    {
      question: "How to Create a Buildable Scorecard?",
      answer: (
        <ul className="instruction-list" style={{ listStyleType: "disc" }}>
          <li><strong>Start a Decision:</strong> Click ‘Make a Decision.’</li>
          <li>
            <strong>Select:</strong> Click “Create Your Own Scorecard” in the top right corner of
            the page.
          </li>
          <li>
            <strong>Quick-View or In-Depth:</strong> Select a Quick-View Scorecard for fast
            insights or In-Depth Scorecard for detailed analysis.
          </li>
          <li>
            <strong>Name Scorecard:</strong> Enter the name of your scorecard and proceed to the
            next step.
          </li>
          <li>
            <strong>Add Decision Makers:</strong> Indicate if you’ll add other decision makers.
          </li>
          <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
            <li>No: You’ll be the sole decision maker.</li>
            <li>
              Yes: Add contributors and assign contribution percentages (total
              must equal 100%).
            </li>
          </ul>
          <li>
            <strong>Customize Weighting:</strong> Enter weighting percentages for each
            contributor for every criterion. (Total for each contributor must
            equal 100%.)
          </li>
          <li>
            <strong>Add Categories and Criteria:</strong> For the Quick-View Scorecard, you can
            include unlimited categories, each featuring a single criterion. For
            the In-Depth Scorecard, you can include unlimited categories, each
            with multiple criteria.
          </li>
          <li>
            <strong>Name Options:</strong> For binary decisions (e.g., Whether to Take a
            Cruise?), name the existing option. For multi-option decisions
            (e.g., Which Cruise to Take?), click ‘Add Option’ and name each
            choice.
          </li>
          <li>
            <strong>Rate Options:</strong> Contributors use an 11-point scale (0 = absolutely not
            aligned, 10 = perfect) to evaluate each option against the criteria.
          </li>
          <li>
            <strong>Reveal Results:</strong> Click ‘Show Results’ to see your options ranked from
            best to worst.
          </li>
        </ul>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="how-to-use-container">
        <h1 className="page-title">How Decidifi Works</h1>
        <p className="instruction-text">
          Follow these instructions when completing any of the following
          scorecards:
        </p>
        <ul className="scorecard-list">
          <li>Quick-View Scorecard</li>
          <li>In-Depth Scorecard</li>
          <li>Buildable Scorecard</li>
        </ul>
        <Collapse
          accordion
          bordered={false}
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            padding: "1rem",
          }}
        >
          {scorecards.map((item, index) => (
            <Panel
              header={item.question}
              key={index}
              className="collapse-panel"
            >
              {item.answer}
            </Panel>
          ))}
        </Collapse>
      </div>
    </DashboardLayout>
  );
};

export default HowToUse;