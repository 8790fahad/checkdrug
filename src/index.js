import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { initializeContract } from "./utils/near";

import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import { RouteApp } from "./route";
import { Notification } from "./utils/Notification";

window.nearInitPromise = initializeContract()
  .then(() => {
    ReactDOM.render(
      <React.StrictMode>
         <Notification />
        <BrowserRouter>
          <RouteApp />
        </BrowserRouter>
      </React.StrictMode>,
      document.getElementById("root")
    );
  })
  .catch(console.error);

reportWebVitals();
