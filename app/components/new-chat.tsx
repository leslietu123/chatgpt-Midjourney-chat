import {useEffect, useRef, useState} from "react";
import {Path, SlotID} from "../constant";
import {IconButton} from "./button";
import {EmojiAvatar} from "./emoji";
import styles from "./new-chat.module.scss";
import LightningIcon from "../icons/lightning.svg";
import EyeIcon from "../icons/eye.svg";
import {useLocation, useNavigate} from "react-router-dom";
import {Mask, useMaskStore} from "../store/mask";
import Locale from "../locales";
import {useAppConfig, useChatStore} from "../store";
import {MaskAvatar} from "./mask";
import {useCommand} from "../command";
import {BUILTIN_MASK_STORE} from "../masks";
import {useMobileScreen} from "@/app/utils";
import {Masks} from "../masks/masks"
import {homelist} from "../static"
import {Link} from "react-router-dom";


function getIntersectionArea(aRect: DOMRect, bRect: DOMRect) {
    const xmin = Math.max(aRect.x, bRect.x);
    const xmax = Math.min(aRect.x + aRect.width, bRect.x + bRect.width);
    const ymin = Math.max(aRect.y, bRect.y);
    const ymax = Math.min(aRect.y + aRect.height, bRect.y + bRect.height);
    const width = xmax - xmin;
    const height = ymax - ymin;
    const intersectionArea = width < 0 || height < 0 ? 0 : width * height;
    return intersectionArea;
}

// function MaskItem(props: { mask: Mask; onClick?: () => void }) {
//   return (
//     <div className={styles["mask"]} onClick={props.onClick}>
//       {/*<MaskAvatar mask={props.mask} />*/}
//       <div className={styles["mask-name"] + " one-line"}>{props.mask.name}</div>
//     </div>
//   );
// }

function MaskItem(props: { mask: Mask; onClick?: () => void }) {
    return (
        <div className={styles["mask"]} onClick={props.onClick}>
            {/*<MaskAvatar mask={props.mask} />*/}
            <div className={styles["mask-img"]}>
                <img src={props.mask.img} alt="" width={200} height={200}/>
            </div>
            <div className={styles["mask-name"] + " one-line"}>{props.mask.name}</div>
        </div>
    );
}

function useMaskGroup(masks: Mask[]) {
    const [groups, setGroups] = useState<Mask[][]>([]);

    useEffect(() => {
        const computeGroup = () => {
            const appBody = document.getElementById(SlotID.AppBody);
            if (!appBody || masks.length === 0) return;

            const rect = appBody.getBoundingClientRect();
            const maxWidth = rect.width;
            const maxHeight = rect.height * 0.6;
            const maskItemWidth = 120;
            const maskItemHeight = 50;

            const randomMask = () => masks[Math.floor(Math.random() * masks.length)];
            let maskIndex = 0;
            const nextMask = () => masks[maskIndex++ % masks.length];

            const rows = Math.ceil(maxHeight / maskItemHeight);
            const cols = Math.ceil(maxWidth / maskItemWidth);

            const newGroups = new Array(rows)
                .fill(0)
                .map((_, _i) =>
                    new Array(cols)
                        .fill(0)
                        .map((_, j) => (j < 1 || j > cols - 2 ? randomMask() : nextMask())),
                );

            setGroups(newGroups);
        };

        computeGroup();

        window.addEventListener("resize", computeGroup);
        return () => window.removeEventListener("resize", computeGroup);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return groups;
}

export function NewChat() {
    const chatStore = useChatStore();
    const maskStore = useMaskStore();
    const theme = useAppConfig().theme;
    const masks = maskStore.getAll();

    // const groups = useMaskGroup(masks);
    const isMobileScreen = useMobileScreen();
    const navigate = useNavigate();
    const config = useAppConfig();


    const maskRef = useRef<HTMLDivElement>(null);

    const {state} = useLocation();

    const startChat = (mask?: Mask) => {
        setTimeout(() => {
            chatStore.newSession(mask);
            navigate(Path.Chat);
        }, 10);
    };

    useCommand({
        mask: (id) => {
            try {
                const mask = maskStore.get(id) ?? BUILTIN_MASK_STORE.get(id);
                startChat(mask ?? undefined);
            } catch {
                console.error("[New Chat] failed to create chat from mask id=", id);
            }
        },
    });

    // useEffect(() => {
    //     if (maskRef.current) {
    //         maskRef.current.scrollLeft =
    //             (maskRef.current.scrollWidth - maskRef.current.clientWidth) / 2;
    //     }
    // }, [groups]);

    return (
        <div className={`${styles["new-chat-home"]} ${theme === "dark" ? styles["new-chat-home-dark"] : ""}`}>
            <div className={styles["new-chat-left"]}>

                <div className={styles["new-chat-left-header"]}>
                    <img src={theme === "dark" ? "./site-logo.png":"./site-logo-light.png"} alt=""/>
                    <div className={styles["new-chat-left-title"]}>{process.env.NEXT_PUBLIC_SITE_SLOGEN}</div>
                    <div className={styles["new-chat-left-sub-title"]}>{process.env.NEXT_PUBLIC_SITE_SUB_SLOGEN}</div>
                    <div className={styles["new-chat-left-header-content"]}>
                        {homelist.item1.map((item, index) => (
                            <button type="button" key={item.id} className={styles["new-chat-left-header-left"]} onClick={()=>navigate(item.path)}>
                                <div className={styles["new-chat-left-header-right-item-header"]}>
                                    <img src={item.icon} width={30} alt=""/>
                                    <span>{item.name}</span>
                                </div>
                                <div className={styles["quick-start"]}>
                                    <span>快速开始</span>
                                    <img width={16} src={theme === "light" ? "./right.svg" : "./right-dark.svg"}
                                         alt=""/>
                                </div>

                            </button>
                        ))}

                        {/*<div className={styles["new-chat-left-header-right"]}>*/}
                        {/*    {homelist.item2.map((item, index) => (*/}
                        {/*        <Link key={item.id} className={styles["new-chat-left-header-right-item"]}*/}
                        {/*              to={item.path}>*/}
                        {/*            <div className={styles["new-chat-left-header-right-item-header"]}>*/}
                        {/*                <img src="./home-chat.svg" width={30} alt=""/>*/}
                        {/*                <h4>{item.name}</h4>*/}
                        {/*            </div>*/}
                        {/*        </Link>*/}
                        {/*    ))}*/}
                        {/*</div>*/}
                    </div>
                </div>
                {/*<div className={styles["new-chat-left-body"]}>*/}
                {/*    <div className={styles["new-chat-left-body-item"]}>*/}

                {/*    </div>*/}
                {/*</div>*/}

            </div>

            <div className={styles["new-chat-right"]}>
                <div className={`${styles["new-chat"]} ${theme === "dark" ? styles["new-chat-dark"] : ""}`}>
                    {/*<div className={styles["mask-cards"]}>*/}
                    {/*    <div className={styles["mask-card"]}>*/}
                    {/*        <EmojiAvatar avatar="1f606" size={24}/>*/}
                    {/*    </div>*/}
                    {/*    <div className={styles["mask-card"]}>*/}
                    {/*        <EmojiAvatar avatar="1f916" size={24}/>*/}
                    {/*    </div>*/}
                    {/*    <div className={styles["mask-card"]}>*/}
                    {/*        <EmojiAvatar avatar="1f479" size={24}/>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<div className={styles["title"]}>{process.env.NEXT_PUBLIC_SITE_SLOGEN}</div>*/}
                    {/*<div className={styles["sub-title"]}>{process.env.NEXT_PUBLIC_SITE_SUB_SLOGEN}</div>*/}

                    {/*<div className={styles["actions"]}>*/}
                    {/*    <IconButton*/}
                    {/*        text={Locale.NewChat.More}*/}
                    {/*        onClick={() => navigate(Path.Masks)}*/}
                    {/*        icon={<EyeIcon/>}*/}
                    {/*        bordered*/}
                    {/*        shadow*/}
                    {/*    />*/}
                    {/*    {isMobileScreen && (*/}
                    {/*        <IconButton*/}
                    {/*            text={Locale.NewChat.list}*/}
                    {/*            onClick={() => navigate(Path.Chat)}*/}
                    {/*            icon={<LightningIcon/>}*/}
                    {/*            shadow*/}
                    {/*            className={styles["skip"]}*/}
                    {/*        />*/}
                    {/*    )}*/}
                    {/*    <IconButton*/}
                    {/*        text={Locale.NewChat.Skip}*/}
                    {/*        onClick={() => startChat()}*/}
                    {/*        icon={<LightningIcon/>}*/}
                    {/*        type="primary"*/}
                    {/*        shadow*/}
                    {/*        className={styles["skip"]}*/}
                    {/*    />*/}
                    {/*</div>*/}

                    <span className={styles["grid-title"]}>一些有趣的角色模型</span>
                    <div className={styles["roles-container"]}>
                        {Masks.map((mask, index) => (
                            <div key={index} className={styles["roles-item"]} onClick={() => startChat(mask)}>
                                <img src={mask.img} alt=""/>
                                <div className={styles["roles-title"]}>
                                    <span>{mask.name}</span>
                                    <p>@{mask.name}</p>
                                </div>

                            </div>
                        ))}
                    </div>
                    <span className={styles["grid-title"]}>其他模型</span>
                    <div className={styles["masks-grid"]} ref={maskRef}>

                        {masks.map((mask, index) => (
                            <div key={mask.id} className={styles["mask-item"]} onClick={() => startChat(mask)}>
                                <div className={styles["mask-header"]}>
                                    <MaskAvatar mask={mask}/>
                                    <img width={16} src={theme === "light" ? "./right.svg" : "./right-dark.svg"}
                                         alt=""/>
                                </div>

                                <div className={styles["mask-info"]}>
                                    <span>{mask.name}</span>
                                    <div>
                                        <p>{mask.context[0].content.slice(0, 35)}...</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>


    );
}
