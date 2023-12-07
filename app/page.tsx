
import {Home} from "./components/home";
import {getServerSideConfig} from "./config/server";
import React from "react";


const serverConfig = getServerSideConfig();


export default async function App() {
    return (
        <>
            <Home/>
        </>
    );
}
