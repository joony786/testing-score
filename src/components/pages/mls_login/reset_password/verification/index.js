import React from "react";
import { Input, Button } from "@teamfabric/copilot-ui";

function VerificationCode() {
  return (
    <form className="block disabled">
      <div className="header">
        <h1>Verification Code</h1>
      </div>

      <div className="body">
        <p>Check your Email ...</p>

        <Input
          className="primary"
          inputProps={{
            type: "number",
          }}
          width="100%"
          label="Verification Code"
        />

        {/* <div className="timer">
          <h2>15</h2>
        </div> */}
      </div>

      <div className="footer">
        <Button
          isPrimary={false}
          onClick={function noRefCheck() {}}
          size="small"
          text="Resend"
        />

        <Button
          onClick={function noRefCheck() {}}
          size="small"
          text="Confirm"
        />
      </div>
    </form>
  );
}

export default VerificationCode;
