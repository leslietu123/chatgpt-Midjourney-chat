import styles from "./left-sidebar.module.scss";
import {Theme, useAppConfig} from "../store/config";
import chakraTheme from "../thems";
import {useLocation} from "react-router-dom";
import {Path} from "../constant";
import {Link} from "react-router-dom";
import {menu} from "../static"
import {ChakraProvider, Icon} from "@chakra-ui/react";
import {RiFlashlightFill, RiSettingsFill, RiUser6Fill, RiVipCrownFill} from "react-icons/ri";


export function LeftSidebar() {

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
        <ChakraProvider theme={chakraTheme}>
            <div className={styles["left-sidebar-container"]}>
                <div className={styles["left-sidebar"]}>

                    <Link to={Path.Home}>
                        <img width={40} src="./tiny-logo.png" alt="site-logo"/>
                    </Link>

                    <div className={styles["left-sidebar-content"]}>
                        {menu.map((item, index) => {
                            // @ts-ignore
                            return (
                                <Link className={`${styles["left-sidebar-content-item"]} ${styles["popup"]} ${location.pathname === item.path ? styles["active"] : ""}`}
                                      key={item.name}
                                      to={item.path}
                                      title={item.title}
                                >
                                    {item.icon}
                                </Link>
                            )
                        })}
                    </div>
                    {/*<Popover children={} content={}/>*/}
                    <div className={styles["left-sidebar-bottom"]}>
                        <Link className={`${styles["left-sidebar-bottom-item"]} ${styles["popup"]}`} key="points"
                              to={Path.BuyPoints} title="积分充值">
                            <Icon as={RiVipCrownFill} width="15px" height="15px" color="#8b00ff"/>
                            {/*<img width={25} src={theme === "dark" ? "./points-light.svg" : "./points-dark.svg"} alt=""/>*/}
                        </Link>
                        <div className={`${styles["left-sidebar-bottom-item"]} ${styles["popup"]}`} key="theme"
                             onClick={nextTheme} title="主题">
                            <Icon as={RiFlashlightFill} width="15px" height="15px" color="inherit"/>
                        </div>
                        <Link className={`${styles["left-sidebar-bottom-item"]} ${styles["popup"]}`} key="settings"
                              title="设置"
                              to={Path.Settings}>
                            <Icon as={RiSettingsFill} width="15px" height="15px" color="inherit"/>
                        </Link>
                        <Link className={`${styles["left-sidebar-bottom-item"]} ${styles["popup"]}`} key="profile"
                              title="个人中心" to={Path.SignUp}>
                            <Icon as={RiUser6Fill} width="15px" height="15px" color="inherit"/>
                        </Link>

                    </div>

                </div>


            </div>
        </ChakraProvider>
    )
}