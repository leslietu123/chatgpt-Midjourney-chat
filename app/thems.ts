import { extendTheme } from "@chakra-ui/react";

const chakraTheme = extendTheme({
    fonts: {
        // body: "Georgia, system-ui, sans-serif",
        heading: "Georgia, serif",
        mono: "Menlo, monospace",
    },
    styles: {
        global: {
            h1: {
                fontFamily: "YRDZST, system-ui, sans-serif",
            },
            h2: {
                fontFamily: "YRDZST, system-ui, sans-serif",
            },
        },
    },
});

export default chakraTheme;