import React, {useEffect, useRef, useState} from "react";

import styles from "./home.module.scss";

import {IconButton} from "./button";
import AddIcon from "../icons/add.svg";
import CloseIcon from "../icons/close.svg";
import MaskIcon from "../icons/mask.svg";
import GemIcon from "../icons/gem.svg";
import DragIcon from "../icons/drag.svg";

import Locale from "../locales";

import {useAppConfig, useChatStore} from "../store";

import {
    MAX_SIDEBAR_WIDTH,
    MIN_SIDEBAR_WIDTH,
    NARROW_SIDEBAR_WIDTH,
    Path,
    REPO_URL,
} from "../constant";

import {useNavigate} from "react-router-dom";
import {useMobileScreen} from "../utils";
import dynamic from "next/dynamic";
import {showConfirm, showToast} from "./ui-lib";
import ReturnIcon from "@/app/icons/return.svg";
import {Flex, FormControl, FormLabel, Link, Switch, Text} from "@chakra-ui/react";
import OwnKeySetting from "@/app/components/own-key-setting";
import {openAIKey} from "@/app/api/back/types";

const ChatList = dynamic(async () => (await import("./chat-list")).ChatList, {
    loading: () => null,
});

function useHotKey() {
    const chatStore = useChatStore();

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.altKey || e.ctrlKey) {
                if (e.key === "ArrowUp") {
                    chatStore.nextSession(-1);
                } else if (e.key === "ArrowDown") {
                    chatStore.nextSession(1);
                }
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    });
}

function useDragSideBar() {
    const limit = (x: number) => Math.min(MAX_SIDEBAR_WIDTH, x);

    const config = useAppConfig();
    const startX = useRef(0);
    const startDragWidth = useRef(config.sidebarWidth ?? 300);
    const lastUpdateTime = useRef(Date.now());

    const handleMouseMove = useRef((e: MouseEvent) => {
        if (Date.now() < lastUpdateTime.current + 50) {
            return;
        }
        lastUpdateTime.current = Date.now();
        const d = e.clientX - startX.current;
        const nextWidth = limit(startDragWidth.current + d);
        config.update((config) => (config.sidebarWidth = nextWidth));
    });

    const handleMouseUp = useRef(() => {
        startDragWidth.current = config.sidebarWidth ?? 300;
        window.removeEventListener("mousemove", handleMouseMove.current);
        window.removeEventListener("mouseup", handleMouseUp.current);
    });

    const onDragMouseDown = (e: MouseEvent) => {
        startX.current = e.clientX;

        window.addEventListener("mousemove", handleMouseMove.current);
        window.addEventListener("mouseup", handleMouseUp.current);
    };
    const isMobileScreen = useMobileScreen();
    const shouldNarrow =
        !isMobileScreen && config.sidebarWidth < MIN_SIDEBAR_WIDTH;

    useEffect(() => {
        const barWidth = shouldNarrow
            ? NARROW_SIDEBAR_WIDTH
            : limit(config.sidebarWidth ?? 300);
        const sideBarWidth = isMobileScreen ? "100vw" : `${barWidth}px`;
        document.documentElement.style.setProperty("--sidebar-width", sideBarWidth);
    }, [config.sidebarWidth, isMobileScreen, shouldNarrow]);

    return {
        onDragMouseDown,
        shouldNarrow,
    };
}

interface SidebarProps {
    className?: string;
    onSubmit?: (formData: any) => void;
    onChange?: () => void;
}

export function SideBar(props: SidebarProps) {
    const chatStore = useChatStore();
    const isMobileScreen = useMobileScreen();

    const {onDragMouseDown, shouldNarrow} = useDragSideBar();
    const navigate = useNavigate();
    const config = useAppConfig();
    const [showSidebar, setShowSidebar] = useState<boolean>(true);

    useHotKey();

    return (
        <div
            className={`${styles.sidebar} ${props.className} ${showSidebar ? styles["show-sidebar"] : ""} ${
                shouldNarrow && styles["narrow-sidebar"]
            }`}
        >
            <div className={styles["sidebar-header"]} data-tauri-drag-region>
                <div className={styles["sidebar-title"]} data-tauri-drag-region>
                    AI 对话
                </div>
            </div>
            <div
                className={styles["sidebar-body"]}
            >
                <ChatList narrow={shouldNarrow} onClick={() => setShowSidebar(!showSidebar)}/>
            </div>
            <Flex justifyContent='center' alignItems='center' border='var(--border-in-light)' p={2} borderRadius={10}>
                <FormControl display='flex' justifyContent='center' alignItems='center'>
                    <FormLabel fontSize={12} mb='0'>
                        使用自己的API{' '}
                        <OwnKeySetting <openAIKey>
                            storageKey='formData'
                            visibleFields={["key","proxy_url"]}
                            onChange={() => {
                                if (typeof props.onChange === 'function') {
                                    props.onChange();
                                }
                            }}
                            title='设置自己的Openai Key'/>
                    </FormLabel>
                </FormControl>
            </Flex>

            <div className={styles["sidebar-tail"]}>

                <div className={styles["sidebar-actions"]}>
                    <div className={styles["sidebar-action"] + " " + styles.mobile}>
                        <IconButton
                            icon={<ReturnIcon/>}
                            onClick={() => navigate(Path.Home)}
                        />
                    </div>
                    <div className={styles["sidebar-action"] + " " + styles.mobile}>
                        <IconButton
                            icon={<CloseIcon/>}
                            onClick={async () => {
                                if (await showConfirm(Locale.Home.DeleteChat)) {
                                    chatStore.deleteSession(chatStore.currentSessionIndex);
                                }
                            }}
                        />
                    </div>
                </div>
                <div>
                    <IconButton
                        icon={<AddIcon/>}
                        text={shouldNarrow ? undefined : Locale.Home.NewChat}
                        onClick={() => {
                            if (config.dontShowMaskSplashScreen) {
                                chatStore.newSession();
                                navigate(Path.Chat);
                            } else {
                                chatStore.newSession();
                                navigate(Path.Chat);
                            }
                        }}
                        shadow
                    />
                </div>
            </div>

            <div
                className={styles["sidebar-drag"]}
                onMouseDown={(e) => onDragMouseDown(e as any)}
            >
                <DragIcon/>
            </div>
        </div>
    );
}
