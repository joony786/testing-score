import React from "react";

import { Dropdown } from "@teamfabric/copilot-ui";

function SwitchDropdown() {
  return (
    <Dropdown
      onSelect={function noRefCheck() {}}
      options={[
        {
          id: 1,
          name: "List Item 1",
        },
        {
          id: 2,
          name: "List Item 2",
        },
      ]}
      titleLabel="Field Label"
      type="small"
      value={{
        id: 0,
        name: "Outlet Name",
      }}
      className="switch_outlet_mobile"
    />
  );
}

export default SwitchDropdown;
