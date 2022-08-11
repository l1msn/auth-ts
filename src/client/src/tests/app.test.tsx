import * as React from "react";
import '@testing-library/jest-dom'
import {render, screen} from "@testing-library/react";


import LoginForm from "../components/LoginForm";
import App from "../App";

describe("Testing appears components on document", ()=> {
    test("Login form components", ()=> {
        //TODO: Fix bug with React 18 and testing library
        /*
        render(<App />);
        screen.debug();
        */
    });
});