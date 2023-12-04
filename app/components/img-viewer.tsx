
import React, {useRef, useState} from "react";
import styles from "./draw.module.scss";
import {Draws} from "@/app/api/backapi/types";
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Image from "next/image";
import {drawRes} from "@/app/api/back/types";

interface imgProps {
    draw?: Draws;
    onDrawImg?:drawRes;
}

const ImgViewer = (props: imgProps) => {
    const [zoom, setZoom] = useState(1);
    const [positionX, setPositionX] = useState(0);
    const [positionY, setPositionY] = useState(0);
    const transformRef = useRef<any>(null);


    // @ts-ignore
    return (
        <div className={styles["image-viewer"]}>
            <div className={styles["crop-container"]}>
                <TransformWrapper
                    ref={transformRef}
                    initialScale={1}
                    initialPositionX={0}
                    initialPositionY={0}
                    limitToBounds={false}
                    minScale={0.5}
                    maxScale={3}
                    // pan={{disabled: false}}
                    pinch={{disabled: false}}
                    doubleClick={{disabled: false}}
                >
                    {({setTransform}) => (
                        <React.Fragment>
                            <TransformComponent>
                                <Image src={props.onDrawImg?.uri || ""} alt={props.onDrawImg?.uri || ""} layout="fill"
                                       className={styles["image-viewer-img"]}/>
                            </TransformComponent>
                            <input
                                type="range"
                                value={zoom}
                                min={0.5}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => {
                                    const newZoom = parseFloat(e.target.value);
                                    setZoom(newZoom);
                                    if (!isNaN(positionX) && !isNaN(positionY) && !isNaN(newZoom)) {
                                        setTransform(positionX, positionY, newZoom, 100);
                                    }
                                }}
                                className={styles["zoom-range"]}
                            />
                        </React.Fragment>
                    )}
                </TransformWrapper>
            </div>
        </div>
    );
};

export default ImgViewer;
