import React from "react";
import PropTypes from "prop-types";

function ListItem({ title = "list item", value = "list value" }) {
  return (
    <li className="list__item">
      <span>{title}</span>
      <span className="list__value">{value}</span>
    </li>
  );
}

ListItem.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
};

export default ListItem;
