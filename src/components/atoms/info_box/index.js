import React from "react";
import {string} from "prop-types";

function InfoBox({ text , number  }) {
  return (
    <div className="box">
      <span className="text">{text}</span>
      <span className="number">{number}</span>
    </div>
  );
}

InfoBox.propTypes = {
  text: string,
  number: string,
};

export default InfoBox;
