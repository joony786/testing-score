import React, { useEffect, useState } from "react";
import { Flyout, ButtonWithIcon } from "@teamfabric/copilot-ui";
let visibleMenu = false;
const ActionMenuForSubItems = (props) => {
  const {
    propId = "",
    propObj = "",
    menuItems = [],
    width = "fit-content",
    text = "Actions",
  } = props;
  const [show, setShow] = useState(false);


  // useEffect(() => {
  //   show ? hideOverflow() : showOverflow();
  // }, [show]);
  // const hideOverflow = () => {
  //   const main = document.querySelector("#root > div.container > main");
  //   main.classList.add("hideOverflow");
  // }
  // const showOverflow = () => {
  //   const main = document.querySelector("#root > div.container > main");
  //   main.classList.remove("hideOverflow");
  // }

  const handleButtonBlurClick = (e) => {
    //console.log("blur");
    //console.log(e.target);
    //console.log(e.target.id);

    setTimeout(() => {
      setShow(false);
    }, 150);
  };

  const handleClick = (e) => {
    //console.log(e.target);
    //console.log(e.target.id);
    setShow(!show);
    visibleMenu = true;
  };

  const handleSelectMenuItem = (item) => {
    //console.log(item);                                     //{label: "Edit"} but not in use now
    props.menuItemClick(propId, propObj, item.label); //imp
    // showOverflow()
    setShow(false); //imp
  };

  const handleOutsideClick = (e) => {
    console.log("outside");
    console.log(e);
    console.log(visibleMenu);
    if (!visibleMenu) {
      setShow(false);
    }

    visibleMenu = false; //imp
  };

  //console.log(show);

  return (
    <>
      <ButtonWithIcon
        className="flyout-menu-action-icon"
        emphasis="low"
        text={text}
        isPrimary={false}
        theme="light"
        onClick={handleClick}
        target={propId} //not compulsary
        id={propId}
        icon="DownArrow"
        iconPosition="right"
        //onBlur={handleButtonBlurClick}
      />

      <Flyout
        className="primary"
        id={propId}
        items={menuItems}
        offset={10}
        // onSelect={function noRefCheck(){}}
        onSelect={handleSelectMenuItem}
        placement="bottomCenter"
        width={width} //imp
        show={show}
        onOutsideClick={handleOutsideClick}
      />
    </>
  );
};
export default ActionMenuForSubItems;
