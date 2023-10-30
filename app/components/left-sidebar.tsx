import styles from "./left-sidebar.module.scss";
import {Theme, useAppConfig} from "../store/config";
import {useLocation} from "react-router-dom";
import {Path} from "../constant";
import {Link} from "react-router-dom";
import {menu} from "../api/backapi/static"


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
        <div className={styles["left-sidebar"]}>

            <Link to={Path.Home}>
                <img width={40} src="./ailogo.svg" alt="site-logo"/>
            </Link>

            <div className={styles["left-sidebar-content"]}>
                {menu.map((item, index) => {
                    // @ts-ignore
                    return (
                        <Link className={`${styles["left-sidebar-content-item"]} ${styles["popup"]}`} key={item.name}
                              to={item.path} title={item.title}>
                            <img
                                width={25}
                                src={
                                    item.path_name === location.pathname ? (theme === "dark" ? item.icon_active : item.icon_active) : (theme === "dark" ? item.icon_dark : item.icon_light)
                                }
                                alt={item.name}
                            />
                        </Link>
                    )
                })}
            </div>
            {/*<Popover children={} content={}/>*/}
            <div className={styles["left-sidebar-bottom"]}>

                <Link className={`${styles["left-sidebar-bottom-item"]} ${styles["popup"]}`} key="points"
                      to={Path.BuyPoints} title="积分充值">
                    <img width={25} src={theme === "dark" ? "./points-light.svg" : "./points-dark.svg"} alt=""/>
                </Link>
                <div className={`${styles["left-sidebar-bottom-item"]} ${styles["popup"]}`} key="theme"
                     onClick={nextTheme} title="主题">
                    <img width={25} src={theme === "dark" ? "./theme-dark.svg" : "./theme-light.svg"} alt=""/>
                </div>
                <Link className={`${styles["left-sidebar-bottom-item"]} ${styles["popup"]}`} key="settings" title="设置"
                      to={Path.Settings}>
                    <img width={25} src={theme === "dark" ? "./settings-dark.svg" : "./settings-light.svg"} alt=""/>
                </Link>
                <Link className={`${styles["left-sidebar-bottom-item"]} ${styles["popup"]}`} key="profile"
                      title="个人中心" to={Path.SignUp}>
                    <img width={25} src={theme === "dark" ? "./profile-dark.svg" : "./profile-light.svg"} alt=""/>
                </Link>

            </div>
        </div>
    )
}