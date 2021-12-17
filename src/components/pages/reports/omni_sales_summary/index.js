import React from "react";
import { Link } from "react-router-dom";

// components
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import SwitchOutlet from "../../../atoms/switch_outlet";
import PageTitle from "../../../organism/header";

function OmniSalesSummary() {
  return (
    <section className="page">
      <div className="page__top">
        <SwitchOutlet />
      </div>

      <PageTitle title="Omni Sales Summary" />

      <div className="page__buttons">
        <Link to="/">
          <CustomButtonWithIcon text="Download" iconName="Download" />
        </Link>
      </div>

      <div className="page__table">{/* <CustomTable /> */}</div>
    </section>
  );
}

export default OmniSalesSummary;
