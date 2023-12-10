"use client";

import {LeftSidebar} from "@/app/components/left-sidebar";

require("../polyfill");
import React, {useState, useEffect} from "react";
import styles from "./home.module.scss";
import BotIcon from "../icons/bot.svg";
import LoadingIcon from "../icons/three-dots.svg";
import mixpanel from "mixpanel-browser";
import {getCSSVar, useMobileScreen} from "../utils";
import dynamic from "next/dynamic";
import {Path, SlotID} from "../constant";
import {ErrorBoundary} from "./error";
import {getISOLang, getLang} from "../locales";
import {HashRouter as Router, useLocation, Routes, Route} from "react-router-dom";
import {useAppConfig} from "@/app/store";
import {AuthPage} from "./auth";
import {getClientConfig} from "../config/client";
import {api} from "../client/api";
import {useAccessStore} from "../store";
import {MobileSidebar} from "@/app/components/mobile-sidebar";
import ChatIcon from "@/app/icons/chat.svg";
import {IconButton} from "@/app/components/button";
import PopUp from "@/app/components/pop";
import {getLocalUserInfo, isLogin} from "@/app/api/backapi/user";
import {ChakraProvider, theme} from "@chakra-ui/react";
import chakraTheme from "@/app/thems";
import {CacheProvider} from '@chakra-ui/next-js'
import {addVisit, getConfig} from "@/app/api/back/user";
import {SiteConfig} from "@/app/api/back/types";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

mixpanel.init(`${process.env.NEXT_PUBLIC_MIXPANEL_CLIENT_ID}`, {debug: true});

export function Loading(props: { noLogo?: boolean }) {
    return (
        <div className={styles["loading-content"] + " no-dark"}>
            {!props.noLogo && <BotIcon/>}
            <LoadingIcon/>
        </div>
    );
}

const Settings = dynamic(async () => (await import("./settings")).Settings, {
    loading: () => <Loading/>,
});

const Chat = dynamic(async () => (await import("./chat")).Chat, {
    loading: () => <Loading/>,
});

const NewChat = dynamic(async () => (await import("./new-chat")).NewChat, {
    loading: () => <Loading/>,
});

const MaskPage = dynamic(async () => (await import("./mask")).MaskPage, {
    loading: () => <Loading/>,
});

const SignUp = dynamic(async () => (await import("./sign-up")).SignUp, {
    loading: () => <Loading/>,
});

const SignIn = dynamic(async () => (await import("./sign-in")).SignIn, {
    loading: () => <Loading/>,
});

const UserProfile = dynamic(async () => (await import("./profile")).UserProfile, {
    loading: () => <Loading/>,
});

const BuyPoints = dynamic(async () => (await import("./shop")).Shop, {
    loading: () => <Loading/>,
});

const Draw = dynamic(async () => (await import("./draw")).Draw, {
    loading: () => <Loading/>,
});

const Ground = dynamic(async () => (await import("./ground")).Ground, {
    loading: () => <Loading/>,
});


export function useSwitchTheme() {
    const config = useAppConfig();

    useEffect(() => {
        document.body.classList.remove("light");
        document.body.classList.remove("dark");

        if (config.theme === "dark") {
            document.body.classList.add("dark");
        } else if (config.theme === "light") {
            document.body.classList.add("light");
        }

        const metaDescriptionDark = document.querySelector(
            'meta[name="theme-color"][media*="dark"]',
        );
        const metaDescriptionLight = document.querySelector(
            'meta[name="theme-color"][media*="light"]',
        );

        if (config.theme === "auto") {
            metaDescriptionDark?.setAttribute("content", "#151515");
            metaDescriptionLight?.setAttribute("content", "#fafafa");
        } else {
            const themeColor = getCSSVar("--theme-color");
            metaDescriptionDark?.setAttribute("content", themeColor);
            metaDescriptionLight?.setAttribute("content", themeColor);
        }
    }, [config.theme]);
}

function useHtmlLang() {
    useEffect(() => {
        const lang = getISOLang();
        const htmlLang = document.documentElement.lang;

        if (lang !== htmlLang) {
            document.documentElement.lang = lang;
        }
    }, []);
}

const useHasHydrated = () => {
    const [hasHydrated, setHasHydrated] = useState<boolean>(false);

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    return hasHydrated;
};

const loadAsyncGoogleFont = () => {
    const linkEl = document.createElement("link");
    const proxyFontUrl = "/google-fonts";
    const remoteFontUrl = "https://fonts.googleapis.com";
    const googleFontUrl =
        getClientConfig()?.buildMode === "export" ? remoteFontUrl : proxyFontUrl;
    linkEl.rel = "stylesheet";
    linkEl.href =
        googleFontUrl + "/css2?family=Noto+Sans:wght@300;400;700;900&display=swap";
    document.head.appendChild(linkEl);
};

function Screen() {
    const theme = useAppConfig().theme;
    const isSignIn = isLogin();
    const config = useAppConfig();
    const location = useLocation();
    const isChat = location.pathname === Path.Chat;
    const isDraw = location.pathname === Path.Draw;
    const isAuth = location.pathname === Path.Auth;
    const isShop = location.pathname === Path.BuyPoints;
    const isGround = location.pathname === Path.Ground;
    const isSign = location.pathname === Path.SignIn || location.pathname === Path.SignUp
    const isMobileScreen = useMobileScreen();
    const isShowKefu = location.pathname === Path.Home
        || location.pathname === Path.UserProfile
        || location.pathname === Path.BuyPoints;
    const [siteConfig, setSiteConfig] = useState<SiteConfig>({} as SiteConfig);

    useEffect(() => {
        loadAsyncGoogleFont();
        try {
            getConfig().then(r => {
                setSiteConfig(r);
            });
        } catch (e) {
            console.error(e);
        }
    }, []);

    useEffect(() => {
        FingerprintJS.load().then(r => {
            r.get().then(async result => {
                await addVisit({
                    user_id: localStorage.getItem("user_token") || "",
                    user_finger_id: result.visitorId,
                    userAgent: navigator.userAgent,
                    path: location.pathname,
                    referrer: document.referrer,
                })
            })
        });

    }, [location.pathname]);

    return (
        <div
            className={
                styles.container +
                ` ${
                    config.tightBorder && !isMobileScreen
                        ? styles["tight-container"]
                        : styles.container
                } ${getLang() === "ar" ? styles["rtl-screen"] : ""} ${theme === "dark" ? styles["dark"] : ""}`
            }
        >
            {/*{isShowKefu && (*/}
            {/*    <>*/}
            {/*        <PopUp title="在线客服" open={showKefu} onClick={() => setShowKefu(false)}*/}
            {/*               buttonText="我知道了" onClose={() => setShowKefu(false)}>*/}
            {/*            <div className={styles["kefu-btn-content"]}>*/}
            {/*                <img className={styles["kefu-btn-img"]} src="./kefu.jpg" alt=""/>*/}
            {/*                <div className={styles["kefu-btn-text"]}>*/}
            {/*                    <p>扫描上方二维码联系我们！</p>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </PopUp>*/}
            {/*        <div className={styles["kefu-btn"]}>*/}
            {/*            <IconButton*/}
            {/*                icon={<ChatIcon/>}*/}
            {/*                className={styles["kefu-btn-icon"]}*/}
            {/*                onClick={() => setShowKefu(true)}*/}
            {/*                bordered*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </>*/}
            {/*)}*/}

            {isAuth ? (
                <>
                    <AuthPage/>
                </>
            ) : (
                <>
                    {/*<SideBar className={isHome ? styles["sidebar-show"] : ""} />*/}
                    {!isMobileScreen && <LeftSidebar siteConfig={siteConfig}/>}
                    {isMobileScreen && !isChat && !isDraw && !isSign && !isShop && !isGround && <MobileSidebar/>}
                    <div className={styles["window-content"]} id={SlotID.AppBody}>
                        <Routes>
                            <Route path={Path.Home} element={<NewChat siteConfig={siteConfig}/>}/>
                            <Route path={Path.NewChat} element={<NewChat siteConfig={siteConfig}/>}/>
                            <Route path={Path.Masks} element={<MaskPage/>}/>
                            <Route path={Path.Chat} element={<Chat/>}/>
                            <Route path={Path.Settings} element={<Settings/>}/>
                            <Route path={Path.SignUp} element={<SignUp/>}/>
                            <Route path={Path.SignIn} element={<SignIn/>}/>
                            <Route path={Path.UserProfile} element={<UserProfile siteConfig={siteConfig}/>}/>
                            <Route path={Path.BuyPoints} element={<BuyPoints/>}/>
                            <Route path={Path.Draw} element={<Draw/>}/>
                            <Route path={Path.Ground} element={<Ground/>}/>
                        </Routes>
                    </div>
                </>
            )}
        </div>
    );
}

export function useLoadData() {
    const config = useAppConfig();

    useEffect(() => {
        (async () => {
            const models = await api.llm.models();
            config.mergeModels(models);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}

export function Home() {

    useSwitchTheme();
    useLoadData();
    useHtmlLang();

    useEffect(() => {
        useAccessStore.getState().fetch();
    }, []);

    if (!useHasHydrated()) {
        return <Loading/>;
    }

    return (
        <ErrorBoundary>
            <CacheProvider>
                <ChakraProvider theme={chakraTheme}>
                    <Router>
                        <Screen/>
                    </Router>
                </ChakraProvider>
            </CacheProvider>
        </ErrorBoundary>
    );
}
