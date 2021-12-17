import React from "react";
import { Switch } from "@teamfabric/copilot-ui";

function Taxation() {
  return (
    <section className="super_admin section">
      <div className="section__heading">
        <h1 className="heading heading--primary">Taxation</h1>
      </div>

      <div className="section__body">
        <div className="row">
          <Switch label="Fabric Taxation" />
        </div>
      </div>
    </section>
  );
}

export default Taxation;
