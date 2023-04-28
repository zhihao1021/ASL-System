import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

import MainContent from "./main";
import LoginBox from "./js/login";

import variablesInit from "./variables";

import "./index.css";
import "./fonts/fonts.css"

const root = ReactDOM.createRoot(document.getElementById("root"));
variablesInit(
    () => {
        root.render(
            <MainContent />
        );
        reportWebVitals();
    },
    () => {
        root.render(
            <LoginBox school="嘉義市嘉華中學" />
        );
    }
);
