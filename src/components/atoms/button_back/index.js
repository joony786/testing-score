import React from "react";
import { Icon } from "@teamfabric/copilot-ui";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function ButtonBack({ text,classes, link, ...rest }) {
  return (
    <Link {...rest} to={link} className={`button__back ${classes}`}>
      <Icon iconName="LeftArrow" size={16} />
      {text}
    </Link>
  );
}

ButtonBack.propTypes = {
  text: PropTypes.string,
  link: PropTypes.string,
};

export default ButtonBack;
