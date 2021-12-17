import React from "react";

// components
import ButtonSearch from "../../../atoms/button_search";
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import CustomSearch from "../../../atoms/search";
import SwitchOutlet from "../../../atoms/switch_outlet";
import PageTitle from "../../../organism/header";
import CustomTable from "../../../organism/table";
import TableHistory from "../../../organism/table_history";

function ProductHistory() {
  return (
    <section className="page reports">
      <div className="page__top">
        <SwitchOutlet />
      </div>

      <PageTitle title="Product History" />

      <div className="page__buttons">
        <CustomButtonWithIcon text="Download" iconName="Download" />
      </div>

      <div className="page__search">
        <CustomSearch />
        <ButtonSearch />
      </div>

      <section className="page__section">
        <h2 className="heading heading--primary">Product Variants</h2>

        <div className="page__table">
          <CustomTable />
        </div>
      </section>

      <section className="page__section">
        <h2 className="heading heading--primary">Product Info</h2>

        <div className="page__table">
          <CustomTable />
        </div>
      </section>

      <section className="page__section">
        <h2 className="heading heading--primary">Product History</h2>

        <div className="page__table">
          <TableHistory />
        </div>
      </section>
    </section>
  );
}

export default ProductHistory;
