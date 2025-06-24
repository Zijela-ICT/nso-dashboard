import React from "react";

function FormattedText({ text }: { text: string }) {
  return text.split("\n").map((line, idx, arr) => (
    <React.Fragment key={idx}>
      {line}
      {idx < arr.length - 1 && <br />}
    </React.Fragment>
  ));
}

export default FormattedText;
