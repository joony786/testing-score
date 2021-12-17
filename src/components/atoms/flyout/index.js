import React, { useEffect, useState } from "react";
import { Flyout, ButtonWithIcon } from "@teamfabric/copilot-ui";

let visibleMenu = false;

function CustomFlyout(props) {
  const { propId = "", propObj = "", menuItems = [], width = "90px" } = props;
  const [show, setShow] = useState(false);

  const handleButtonBlurClick = (e) => {
    setTimeout(() => {
      setShow(false);
    }, 200);
  };

  const handleClick = (e) => {
    setShow(!show);
    visibleMenu = true;
  };

  const handleSelectMenuItem = (item) => {
    showOverflow()
    props.menuItemClick(propId, propObj, item.label);
    setShow(false)
  };

  const handleOutsideClick = (e) => {
    if (!visibleMenu) {
      setShow(false);
    }

    visibleMenu = false;
  };


  /* 
  Use-Case: we need to append Overflow-hidden on  Main component which is inside App .
      first solution through context-API [side effect whole application will rerender by Provider]
      second thought Zustand a minimal size state management for React [only effect will be rerender not whole app]
      third solution through Dom manipulation . [not a optimized solution w.r.t react]
 */

  useEffect(() => {
    show ? hideOverflow() : showOverflow();
  }, [show]);

  const hideOverflow = () => {
    const main = document.querySelector("#root > div.container > main");
    const pageTable = document.querySelector("#root > div.container > main > section > div.page__table")
    const pageTabs =  document.querySelector("#root > div.container > main > section > div.page__tabs")
   main.classList.add("hideOverflow");
    if(pageTable){
      pageTable.classList.add("hideOverflow");
    }
    if(pageTabs){
      pageTabs.classList.add("hideOverflow");
    }
   
  };

  const showOverflow = () => {
    const main = document.querySelector("#root > div.container > main");
    const pageTable = document.querySelector("#root > div.container > main > section > div.page__table")
    const pageTabs =  document.querySelector("#root > div.container > main > section > div.page__body > div.page__tabs")
  
    main.classList.remove("hideOverflow");
    if(pageTable) {
      pageTable.classList.remove("hideOverflow");
    }
    if(pageTabs) {
      pageTabs.classList.remove("hideOverflow");
    }
   
  };
  return (
    <>
      <ButtonWithIcon
        className="flyout-action-icon"
        emphasis="low"
        icon="Dots"
        isPrimary={false}
        isRoundIcon
        theme="light"
        onClick={handleClick}
        id={propId}
        onBlur={handleButtonBlurClick}
      />
      <Flyout
        className="primary"
        id={propId}
        items={menuItems}
        offset={10}
        onSelect={handleSelectMenuItem}
        placement="bottomCenter"
        width={width}
        show={show}
        onOutsideClick={handleOutsideClick}
      />
    </>
  );
}

export default CustomFlyout;
