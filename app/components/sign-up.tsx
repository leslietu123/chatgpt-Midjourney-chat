import Locale from "@/app/locales";
import {IconButton} from "@/app/components/button";
import CloseIcon from "@/app/icons/close.svg";
import {Path} from "@/app/constant";
import {useLocation, useNavigate} from "react-router-dom";
import {ErrorBoundary} from "@/app/components/error";
import styles from './sign-up.module.scss';
import {useEffect, useState} from "react";
import {getToken, registerUser, sendVerificationCode, verifyCode,isLogin} from "../api/backapi/user";
import {useAppConfig} from "@/app/store";
import {showToast} from "./ui-lib";
import {Link} from "react-router-dom";
import {authSms, isUser, sendSms, signUp, userLogin} from "@/app/api/back/user";


export function SignUp() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const shareCode = searchParams.get("ref");
    const navigate = useNavigate();
    const theme = useAppConfig().theme;
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [codeSend, setCodesend] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [loading ,setLoading] = useState(false);
    const loginStatus = isLogin();


    useEffect(() => {
        if (shareCode) {
            setInviteCode(shareCode);
        };
        if(loginStatus){
            showToast("已登录")
            navigate(Path.UserProfile);
        }
    }, []);

    useEffect(() => {
        let intervalId: string | number | NodeJS.Timeout | undefined;

        if (codeSend && countdown > 0) {

            intervalId = setInterval(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            setCodesend(false);
            setCountdown(60);

        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [codeSend, countdown]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        if (phoneNumber.length != 11) {
            showToast("请输入正确的手机号");
            setLoading(false)
            return;
        }
        if (password.length < 6) {
            showToast("密码长度不能小于6位")
            setLoading(false)
            return;
        }
        if (verificationCode.length != 6) {
            showToast("请输入正确的验证码")
            setLoading(false)
            return;
        }
        if (password === '' || phoneNumber === '' || verificationCode === '') {
            showToast("请填写完整信息")
            setLoading(false)
            return;
        }
        try {
            const verifyRes = await authSms(phoneNumber, verificationCode);
            if (verifyRes.status) {
                const data = {
                    name: phoneNumber,
                    phone: phoneNumber,
                    password: password,
                    ref_code: inviteCode
                }
                const res = await signUp(data);
                if (isUser(res)) {
                    showToast('注册成功')
                    const tokenRes = await userLogin(phoneNumber, password);
                    if (tokenRes.jwtToken !== ""){
                        localStorage.setItem("user_token", tokenRes.jwtToken);
                        setLoading(false)
                        navigate(Path.UserProfile);
                    }else {
                        showToast("注册失败")
                        setLoading(false)
                        return;
                    }
                } else {
                    showToast(res.message)
                    setLoading(false)
                    return;
                }
            } else {
                showToast("验证码错误")
                setLoading(false)
                return;
            }
        } catch (error: any) {
            showToast(error.message)
            setLoading(false)
            console.log(error);
        }
    };

    const handleGetVerificationCode = async () => {
        try {
            const res = await sendSms(phoneNumber);
            showToast(res.message)
        } catch (error: any) {
            console.log(error);
        }
    };
    return (
        <ErrorBoundary>
            <div className="window-header">
                <div className="window-header-title">
                    <div className="window-header-main-title">
                        注册
                    </div>
                    <div className="window-header-sub-title">
                        @创建新用户
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
                        <h2>用户注册</h2>
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
                                {/*<label htmlFor="verificationCode">验证码</label>*/}
                                <div className={styles["get-verificationcode"]}>
                                    <input
                                        type="text"
                                        id="verificationCode"
                                        value={verificationCode}
                                        maxLength={6}
                                        placeholder={"请输入验证码"}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                    />
                                    <button type="button" className={styles["get-code"]}
                                            onClick={handleGetVerificationCode} disabled={codeSend}>
                                        {codeSend ? `${countdown}秒` : '获取验证码'}
                                    </button>
                                </div>
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
                            <div className={styles["form-group"]}>
                                {/*<label htmlFor="inviteCode">邀请码</label>*/}
                                <input
                                    type="text"
                                    id="inviteCode"
                                    value={inviteCode}
                                    placeholder={"请输入邀请码 #可选"}
                                    onChange={(e) => setInviteCode(e.target.value)}
                                />
                            </div>
                            <button
                                className={`${styles["submit-btn"]} ${!phoneNumber || !password || !verificationCode ? styles["submit-btn-disable"] : ""}`}
                                type="submit"
                                disabled={!phoneNumber || !password || !verificationCode}
                            >
                                {loading ? "注册中..." : "立即注册"}
                            </button>
                        </form>
                        <span className={styles["sign-in-up"]}>
                            <span>已有账号？</span>
                            <Link className={styles["sign-in-up-link"]} to={Path.SignIn}>去登录</Link>
                        </span>
                    </div>
                </div>
            </div>


        </ErrorBoundary>
    )
}


