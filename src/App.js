import React from "react";
import "./styles/style.scss";
import { GlobalStyle, theme } from "@teamfabric/copilot-ui";
import { ThemeProvider } from "styled-components";
import "react-datepicker/dist/react-datepicker.css";

// components
import SideNav from "./components/atoms/navigation";
import Main from "./components/organism/main";
import DemoHeader from "./components/atoms/demo_header";
import AppAlert from "./components/atoms/appAlertUiContent";
import MobileNav from "./components/molecules/mobile_nav";
import MobileOutlets from "./components/molecules/mobile_switch_outlets";
import MobileNavCustom from "./components/molecules/mobile_nav_custom";

function App() {
  const handleNavigationButtonClick = () => {
    if (document.querySelector(".nav_container")) {
      let element = document.querySelector(".nav_container");
      element.classList.toggle("show");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <GlobalStyle />
        <div className="demo_header">
          <DemoHeader />
        </div>
        <AppAlert showAlert={true} />
        <div className="container">
          <MobileNavCustom />
          <MobileOutlets />
          <SideNav />
          <Main onNavigationButtonClick={handleNavigationButtonClick} />
        </div>
      </React.Fragment>
    </ThemeProvider>
  );
}

export default App;
