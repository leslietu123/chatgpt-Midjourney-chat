import {DeleteOutlined} from "@ant-design/icons";
import React, {useState, useRef} from "react";
import styles from "./draw-imageuploader.module.scss";

interface ImageUploaderProps {
    onUpload: (uploadedImages: string[]) => void;
}

export function ImageUploader(props: ImageUploaderProps) {
    const [images, setImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files!).slice(0, 5);

        Promise.all(
            files.map(
                (file) =>
                    new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();

                        reader.onloadend = () => {
                            resolve(reader.result as string);
                        };

                        reader.onerror = reject;

                        reader.readAsDataURL(file);
                    }),
            ),
        )
            .then((results) => {
                const uploadedImages = [...images, ...results];
                setImages(uploadedImages);
                props.onUpload(uploadedImages);
            })
            .catch((error) => {
                console.log("Error uploading images:", error);
            });
    };

    const handleImageRemove = (index: number) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

    return (
        <div className={styles["upload-container"]}>
            <div className={styles["upload-btn"]} onClick={handleButtonClick}>
        <span>
          <img src="/icons8-image.svg" alt=""/>
          选择最多5张图片 {images.length}/5
        </span>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{display: "none"}}
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                />
            </div>

            <div className={styles["upload-images-list"]}>
                {images.map((image, index) => (
                    <div key={index} className={styles["upload-images-item-panel"]}>
                        <img
                            key={index}
                            src={image}
                            alt={`Image ${index + 1}`}
                            className={styles["upload-images-item"]}
                        />
                        <span
                            className={styles["upload-images-item-remove"]}
                            onClick={() => handleImageRemove(index)} // 在点击事件处理函数中调用 handleImageRemove，并传入图片索引
                        >
              <DeleteOutlined/>
            </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ImageUploader;
