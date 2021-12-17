import React from "react";

// components
import CustomButtonWithIcon from "../../../atoms/button_with_icon";

function InventorySync() {
  return (
    <section className="page">
      <div className="page__buttons">
        <CustomButtonWithIcon text="Inventory Sync" iconName="Add" />
      </div>

      <div className="page__table">{/* <CustomTable /> */}</div>
    </section>
  );
}

export default InventorySync;
