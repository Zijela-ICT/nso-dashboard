// import { UnorderedList, UnorderedNestedListItem } from "@/types/types";
// import React from "react";

// interface Linkable {
//   type: "linkable";
//   content: {
//     text: string;
//     linkTo?: string;
//     linkType: "internal" | "external";
//     textStyle?: object;
//   }[];
//   style?: object;
// }

// // Component to render the unordered list
// const UnorderedListRenderer: React.FC<{ list: UnorderedList }> = ({ list }) => {
//   const isUnorderedNestedListItem = (
//     item: unknown
//   ): item is UnorderedNestedListItem => {
//     return (item as UnorderedNestedListItem).nestedItems !== undefined;
//   };

//   return (
//     <ul className="list-disc pl-5">
//       {list.items.map((item, index) => {
//         if (typeof item === "string") {
//           return <li key={index}>{item}</li>;
//         }

//         if ("nestedItems" in item) {
//           return (
//             <li key={index}>
//               {typeof item.content === "string"
//                 ? item.content
//                 : renderContent(item.content)}
//               {item.nestedItems && (
//                 <UnorderedListRenderer list={item.nestedItems} />
//               )}
//             </li>
//           );
//         }

//         return (
//           <li key={index}>
//             {isUnorderedNestedListItem(item) ? (
//               <>
//                 {renderContent(item.content)}
//                 {item.nestedItems && (
//                   <UnorderedListRenderer list={item.nestedItems} />
//                 )}
//               </>
//             ) : (
//               renderContent(item) // For Text or Linkable types
//             )}
//           </li>
//         );
//       })}
//     </ul>
//   );
// };

// // Helper function to render content based on its type
// const renderContent = (content: string | Text | Linkable) => {
//   if (typeof content === "string") {
//     return content;
//   }

//   if ("text" in content) {
//     return content.text; // Render Text
//   }

//   if (content.type === "linkable") {
//     return (
//       <a
//         href={content.content[0].linkTo}
//         target={content.content[0].linkType === "external" ? "_blank" : "_self"}
//         style={content.content[0].textStyle}
//       >
//         {content.content[0].text}
//       </a>
//     ); // Render Linkable
//   }

//   return null;
// };

// export default UnorderedListRenderer;
