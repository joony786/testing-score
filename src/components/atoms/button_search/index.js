import React from "react";
import { Button, ButtonLoader } from "@teamfabric/copilot-ui";

function ButtonSearch({ text= 'Search', clickHandler = function noRefCheck(){}, isLoading = false  }) {
  return isLoading ? (
    <ButtonLoader
      theme="light"
      width="200px"
      height="36px"
      className="button__loader"
    />
  ) : (
   <Button onClick={clickHandler} text={text} />
  )
}

export default ButtonSearch;
