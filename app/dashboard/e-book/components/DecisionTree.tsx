import { IDecisionTree } from "../booktypes";
import React from "react";

const DecisionTreeRenderer: React.FC<{
  decisionTree: IDecisionTree;
  handleMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void;
}> = ({ decisionTree, handleMouseEnter }) => {
  return (
    <div
      className="decision-tree-renderer"
      data-text_path={decisionTree.title}
      onMouseEnter={handleMouseEnter}
    >
      {/* Upper Table: Questions and Examinations */}
      <table className="w-full border-collapse border border-gray-300 mb-4">
        <thead className="bg-[#0CA554] text-white">
          <tr>
            <th className="border border-gray-300 p-2">HISTORY</th>
            <th className="border border-gray-300 p-2">EXAMINATIONS/ACTIONS</th>
          </tr>
        </thead>
        <tbody className="bg-[#FFFAEB]">
          <tr>
            <td className="border border-gray-300 p-2">
              <ul>
                {decisionTree.history.map((question, index) => (
                  <li className="mb-1" key={index}>
                    {index + 1}.{question}
                  </li>
                ))}
              </ul>
            </td>
            <td className="border border-gray-300 p-2">
              <ul>
                {decisionTree.examinationsActions.map((examination, index) => (
                  <li className="mb-1" key={index}>
                    {index + 1}.{examination}
                  </li>
                ))}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Lower Table: Findings and Actions */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-[#0CA554] text-white">
          <tr>
            <th className="border border-gray-300 p-2">FINDINGS ON HISTORY</th>
            <th className="border border-gray-300 p-2">
              FINDINGS ON EXAMINATION
            </th>
            <th className="border border-gray-300 p-2">CLINICAL JUDGMENT</th>
            <th className="border border-gray-300 p-2">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {decisionTree.cases.map((ailment, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-[#ECFDF3]" : "bg-[#fbffff]"}
            >
              <td className="border border-gray-300 p-2 align-top">
                <ul>
                  {ailment.findingsOnExamination.map((itm, i) => (
                    <li className="mb-1" key={i}>
                      {i + 1}.{itm}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="border border-gray-300 p-2 align-top">
                <ul>
                  {ailment.decisionDependencies.map((finding, findingIndex) => (
                    <li className="mb-1" key={findingIndex}>
                      {findingIndex + 1}.{finding}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="border border-gray-300 p-2 align-top">
                {ailment.clinicalJudgement}
              </td>
              <td className="border border-gray-300 p-2 align-top">
                <ol className="pl-6 list-decimal">
                  {ailment.actions.map((action, actionIndex) => (
                    <li className="w-full" key={actionIndex}>
                      {action}
                    </li>
                  ))}
                </ol>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!!decisionTree?.healthEducation.length && (
        <>
          <p className="mt-4 mb-2 text-[#0CA554]">Health education</p>
          <ul>
            {decisionTree?.healthEducation.map((item, i) => (
              <li key={i} className="mb-1">
                {i + 1}. {item}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default DecisionTreeRenderer;
