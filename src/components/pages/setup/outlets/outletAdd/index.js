import React from "react";
import OutletForm from "../common/outlet-form";

function NewOutlet(props) {
  const {isAuth = true} = props;
  return (
    <OutletForm heading="Add Outlet" buttonText="Add" isAuth={isAuth}/>
   );
}

export default NewOutlet;
