import React from "react";
import { Switch, Input } from "@teamfabric/copilot-ui";

function SuperAdmin() {
  return (
    <section className="super_admin section">
      <div className="section__heading">
        <h1 className="heading heading--primary">Super Admin</h1>
      </div>

      <div className="section__body">
        <div className="row">
          <Switch label="Super Admin" />
        </div>

        <div className="row">
          <Switch label="PO Threshold" />

          <form className="form">
            <Input
              className="primary"
              inputProps={{
                disabled: false,
              }}
              label="Total Quantities"
            />

            <Input
              className="primary"
              inputProps={{
                disabled: false,
              }}
              label="Total Value"
            />
          </form>
        </div>

        <div className="row">
          <Switch label="STR Threshold" />
        </div>
      </div>
    </section>
  );
}

export default SuperAdmin;
