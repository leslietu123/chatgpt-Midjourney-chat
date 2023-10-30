import React from "react"
import ContentLoader, { IContentLoaderProps } from "react-content-loader"
import {useMobileScreen} from "@/app/utils";

function Loading (props: React.JSX.IntrinsicAttributes & IContentLoaderProps)  {
    const isMobile = useMobileScreen();
    return(
        <ContentLoader
            speed={5}
            width={isMobile ? 300 : 1200}
            height={160}
            viewBox={isMobile ? "0 0 300 160" : "0 0 1200 160"}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            {...props}
        >
            <rect x="48" y="8" rx="3" ry="3"  height="6" style={{width:"100%"}}/>
            <rect x="48" y="26" rx="3" ry="3"  height="6" style={{width:"100%"}}/>
            <rect x="0" y="56" rx="3" ry="3"  height="6" style={{width:"100%"}}/>
            <rect x="0" y="72" rx="3" ry="3"  height="6" style={{width:"100%"}} />
            <rect x="0" y="88" rx="3" ry="3"  height="6" style={{width:"100%"}} />
            <rect x="0" y="104" rx="3" ry="3"  height="6" style={{width:"100%"}} />
            <rect x="0" y="120" rx="3" ry="3"  height="6" style={{width:"100%"}} />
            <circle cx="20" cy="20" r="20" />
        </ContentLoader>
        )

}



export default Loading
