import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import AppLoader from "./components/atoms/appLoaderContent";


ReactDOM.render(
  <React.StrictMode>
      <Router basename="/pos">
        <AppLoader />
        <App />
      </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
