import Locale from "@/app/locales";
import {IconButton} from "@/app/components/button";
import CloseIcon from "@/app/icons/close.svg";
import {Path} from "@/app/constant";
import {useLocation, useNavigate} from "react-router-dom";
import {ErrorBoundary} from "@/app/components/error";
import styles from './sign-up.module.scss';
import React, {useEffect, useState} from "react";
import {getToken, isLogin} from "../api/backapi/user";
import {useAppConfig} from "@/app/store";
import {showToast} from "./ui-lib";
import {Link} from "react-router-dom";
import {userLogin} from "@/app/api/back/user";


export function SignIn() {
    const navigate = useNavigate();
    const theme = useAppConfig().theme;
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [loading ,setLoading] = useState(false);
    const loginStatus = isLogin();


    useEffect(() => {
        if (loginStatus) {
            showToast("已登录")
            navigate(Path.UserProfile);
        }
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (phoneNumber.length != 11) {
            showToast("请输入正确的手机号");
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            showToast("密码长度不能小于6位")
            setLoading(false);
            return;
        }
        if (password === '' || phoneNumber === '') {
            showToast("请填写完整信息")
            setLoading(false);
            return;
        }
        try {
            const loginRes =await userLogin(phoneNumber, password);
            console.log(loginRes);
            if (loginRes.jwtToken && loginRes.jwtToken !== "") {
                localStorage.setItem("user_token", loginRes.jwtToken);
                showToast("登录成功")
                setLoading(false);
                navigate(Path.UserProfile);
            } else {
                showToast("登录失败")
                setLoading(false);
                return;
            }

        } catch (error: any) {
            setLoading(false);
            showToast(error.message)
        }
    };

    return (
        <ErrorBoundary>
            <div className="window-header">
                <div className="window-header-title">
                    <div className="window-header-main-title">
                        登录
                    </div>
                    <div className="window-header-sub-title">
                        @登录已有账户
                    </div>
                </div>
                <div className="window-actions">
                    <div className="window-action-button"></div>
                    <div className="window-action-button"></div>
                    <div className="window-action-button">
                        <IconButton
                            icon={<CloseIcon/>}
                            onClick={() => navigate(Path.Home)}
                            bordered
                        />
                    </div>
                </div>
            </div>
            <div className={styles["register-container"]}>
                <div className={styles["register-form"]}>
                    <div className={styles["register-content"]}>
                        <h2>用户登录</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles["form-group"]}>
                                {/*<label htmlFor="phone">手机号</label>*/}
                                <input
                                    type="text"
                                    id="phone"
                                    maxLength={11}
                                    value={phoneNumber}
                                    placeholder={"请输入手机号"}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                            <div className={styles["form-group"]}>
                                {/*<label htmlFor="password">密码</label>*/}
                                <div className={styles["get-verificationcode"]}>
                                    <input
                                        type={isPasswordVisible ? "text" : "password"}
                                        id="password"
                                        maxLength={16}
                                        value={password}
                                        placeholder={"请输入密码"}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <span onClick={() => setPasswordVisible(!isPasswordVisible)}
                                          className={styles["password-visible"]}>
                                    <img width={15}
                                         src={isPasswordVisible ? (theme === "light" ? "./hide-light.svg" : "./hide-dark.svg") : (theme === "light" ? "./show-light.svg" : "./show-dark.svg")}
                                         alt=""/>
                                </span>
                                </div>
                            </div>
                            <button
                                className={`${styles["submit-btn"]} ${!phoneNumber || !password  ? styles["submit-btn-disable"] : ""}`}
                                type="submit"
                                disabled={!phoneNumber || !password }
                            >
                                {loading ? "登录中..." : "登录"}
                            </button>
                        </form>
                        <span className={styles["sign-in-up"]}>
                            <span>还没有账号？</span>
                            <Link className={styles["sign-in-up-link"]} to={Path.SignUp}>去注册</Link>
                        </span>
                    </div>
                </div>
            </div>


        </ErrorBoundary>
    )
}


