import React from "react";
import Email from "./email";
import NewPassword from "./new";
import VerificationCode from "./verification";

function ResetPassword() {
  return (
    <div className="reset">
      <div className="reset__wrapper">
        <Email />
        <VerificationCode />
        <NewPassword />
      </div>
    </div>
  );
}

export default ResetPassword;
