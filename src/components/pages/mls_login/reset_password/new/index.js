import React from "react";
import { Input, Button } from "@teamfabric/copilot-ui";

function NewPassword() {
  return (
    <form className="block disabled">
      <div className="header">
        <h1>New Password</h1>
      </div>

      <div className="body">
        <p>Enter the new password ...</p>

        <Input
          className="password"
          inputProps={{
            type: "password",
          }}
          label="Password"
          width="100%"
        />
      </div>

      <div className="footer">
        <Button
          onClick={function noRefCheck() {}}
          size="small"
          text="Set Password"
        />
      </div>
    </form>
  );
}

export default NewPassword;
