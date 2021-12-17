import React from "react";
import PropTypes from "prop-types";

function ButtonUpload({ text, uploadHandler, acceptType = "*" }) {
  return (
    <>
      <label className="button_upload">
        {text}
        <input
          type="file"
          accept={acceptType}
          onChange={uploadHandler}
        ></input>
      </label>
    </>
  );
}

ButtonUpload.propTypes = {
  text: PropTypes.string,
};

export default ButtonUpload;
