import React from "react";
import PropTypes from "prop-types";

function PageTitle({ title }) {
  return (
    <div className="page__title">
      <h2 className="heading heading--primary">{title}</h2>
    </div>
  );
}

PageTitle.propTypes = {
  title: PropTypes.string,
};

export default PageTitle;
