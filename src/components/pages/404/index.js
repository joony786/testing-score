import React from "react";
import CustomButtonWithIcon from "../../atoms/button_with_icon";

function Error404() {
  return (
    <div className="error_404">
      <div className="container">
        <h1>ERROR 404</h1>
        <h1>Page Not Found</h1>
        <p>some text goes here</p>
        <CustomButtonWithIcon size="small" isPrimary={true} text="Button" />
      </div>
    </div>
  );
}

export default Error404;
