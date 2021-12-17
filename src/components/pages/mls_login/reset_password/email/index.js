import React from "react";
import { Input, Link, Button } from "@teamfabric/copilot-ui";

function Email() {
  return (
    <form className="block">
      <div className="header">
        <h1>Reset Password</h1>
      </div>

      <div className="body">
        <p>If you have forgotten your password ...</p>

        <Input
          className="primary"
          inputProps={{
            disabled: false,
          }}
          label="Email Address"
          width="100%"
        />
      </div>

      <div className="footer">
        <Button
          onClick={function noRefCheck() {}}
          size="small"
          text="Send Email"
        />
      </div>
    </form>
  );
}

export default Email;
