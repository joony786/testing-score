import React from "react";
import PropTypes from "prop-types";

// components
import ListItem from "./item";

function List({ title = "List Title", listItemsData = [] }) {
  return (
    <div className="list">
      <h2 className="heading heading--primary">{title}</h2>
      <ul>
        {listItemsData?.map((item, i) => (
          <ListItem key={i} value={item.value} title={item.title} />
        ))}
      </ul>
    </div>
  );
}

List.propTypes = {
  title: PropTypes.string,
};

export default List;
