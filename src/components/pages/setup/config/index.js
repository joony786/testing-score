import React from "react";

// components
import SuperAdmin from "./super_admin";
import Barcode from "./barcode";
import Taxation from "./taxation";

function SetupConfig() {
  return (
    <div className="config">
      <SuperAdmin />
      <Barcode />
      <Taxation />
    </div>
  );
}

export default SetupConfig;
