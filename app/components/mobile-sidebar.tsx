import styles from "./mobile-sidebar.module.scss";
import {Theme, useAppConfig} from "../store/config";
import {useLocation} from "react-router-dom";
import {Path} from "../constant";
import {Link} from "react-router-dom";
import {ChakraProvider, Icon} from "@chakra-ui/react";
import {HiChatBubbleLeftRight, HiMiniHome, HiMiniSparkles, HiPaintBrush, HiUser} from "react-icons/hi2";
import {RiSettings3Fill} from "react-icons/ri";
import chakraTheme from "@/app/thems";

const menu = [
    {
        name: "Home",
        title: "主页",
        icon: <Icon as={HiMiniHome} width="20px" height="20px" color="inherit"/>,
        icon_dark: "./home-dark.svg",
        icon_light: "./home-light.svg",
        icon_active: "./home-active.svg",
        path: Path.Home,
        path_name: "/",
    },
    {
        name: "Chat",
        title: "AI 对话",
        icon: <Icon as={HiChatBubbleLeftRight} width="20px" height="20px" color="inherit"/>,
        icon_dark: "./chat-dark.svg",
        icon_light: "./chat-light.svg",
        icon_active: "./chat-active.svg",
        path: Path.Chat,
        path_name: "/chat",
    },
    {
        name: "Draw",
        title: "AI 绘画",
        icon: <Icon as={HiPaintBrush} width="20px" height="20px" color="inherit"/>,
        icon_dark: "./draw-dark.svg",
        icon_light: "./draw-light.svg",
        icon_active: "./draw-active.svg",
        path: Path.Draw,
        path_name: "/draw",
    },
    {
        name: "Profile",
        title: "个人中心",
        icon: <Icon as={HiUser} width="20px" height="20px" color="inherit"/>,
        icon_dark: "./profile-dark.svg",
        icon_light: "./profile-light.svg",
        icon_active: "./profile-active.svg",
        path: Path.UserProfile,
        path_name: "/user",
    },
    {
        name: "Ground",
        title: "绘画广场",
        icon: <Icon as={HiMiniSparkles} width="20px" height="20px" color="inherit"/>,
        icon_dark: "./ground-dark.svg",
        icon_light: "./ground-light.svg",
        icon_active: "./ground-active.svg",
        path: Path.Ground,
        path_name: "/ground",
    },
    {
        name: "Settings",
        title: "系统设置",
        icon: <Icon as={RiSettings3Fill} width="20px" height="20px" color="inherit"/>,
        icon_dark: "./settings-dark.svg",
        icon_light: "./settings-light.svg",
        icon_active: "./settings-active.svg",
        path: Path.Settings,
        path_name: "/settings",
    }
]

export function MobileSidebar() {

    const config = useAppConfig();
    const theme = config.theme;
    const location = useLocation();

    function nextTheme() {
        const themes = [Theme.Light, Theme.Dark];
        const themeIndex = themes.indexOf(theme);
        const nextIndex = (themeIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];
        config.update((config) => (config.theme = nextTheme));
    }


    return (
            <div className={styles["mobile-sidebar"]}>

                {/*<Link to={Path.Home} >*/}
                {/*    <img width={40} src="./ailogo.svg" alt="site-logo"/>*/}
                {/*</Link>*/}

                <div className={styles["mobile-sidebar-content"]}>
                    {menu.map((item, index) => {
                        // @ts-ignore
                        return (
                            <Link className={`${styles["mobile-sidebar-content-item"]} ${styles["popup"]}`}
                                  key={item.name} to={item.path} title={item.title}>
                                {item.icon}
                            </Link>
                        )
                    })}
                </div>

            </div>
    )
}