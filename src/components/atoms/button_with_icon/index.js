import React from "react";
import { ButtonWithIcon, ButtonLoader } from "@teamfabric/copilot-ui";
import PropTypes from "prop-types";

const CustomButtonWithIcon = ({
  onClick = () => {},
  text = "Button",
  isPrimary = false,
  iconPosition = "left",
  className = "button",
  icon,
  theme = "light",
  emphasis = "low",
  target,
  isLoading = false,
  id = "",
  size,
  disabled  = false,
}) => {
  return isLoading ? (
    <ButtonLoader
      theme="light"
      width="200px"
      height="36px"
      className="button__loader"
    />
  ) : (
    <ButtonWithIcon
      emphasis={emphasis}
      icon={icon}
      iconPosition={iconPosition}
      isPrimary={isPrimary}
      text={text}
      theme={theme}
      className={className}
      target={target}
      onClick={onClick}
      id={id}
      size={size}
      disabled={disabled}
    />
  );
};

export default CustomButtonWithIcon;
CustomButtonWithIcon.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
  isPrimary: PropTypes.bool,
  iconPosition: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.string,
  id: PropTypes.string,
  theme: PropTypes.string,
  emphasis: PropTypes.string,
  target: PropTypes.string,
  isLoading: PropTypes.bool,
  size: PropTypes.string,
};
