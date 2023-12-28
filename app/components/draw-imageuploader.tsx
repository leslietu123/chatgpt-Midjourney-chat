// import {DeleteOutlined} from "@ant-design/icons";
// import React, {useState, useRef} from "react";
// import styles from "./draw-imageuploader.module.scss";
// import {AiOutlineCloudUpload} from "react-icons/ai";
// import {GiTwoCoins} from "react-icons/gi";
// import {Icon} from "@chakra-ui/react";
//
// interface ImageUploaderProps {
//     onUpload: (uploadedImages: File[]) => void;
// }
//
// export function ImageUploader(props: ImageUploaderProps) {
//     const [images, setImages] = useState<File[]>([]);
//     const fileInputRef = useRef<HTMLInputElement>(null);
//
//     const handleButtonClick = () => {
//         fileInputRef.current?.click();
//     };
//
//     const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = Array.from(e.target.files!).slice(0, 5);
//         const uploadedImages = [...images, ...files];
//         setImages(uploadedImages);
//         props.onUpload(uploadedImages);
//     };
//
//     const handleImageRemove = (index: number) => {
//         const updatedImages = [...images];
//         updatedImages.splice(index, 1);
//         setImages(updatedImages);
//     };
//
//     return (
//         <div className={styles["upload-container"]}>
//             <div className={styles["upload-btn"]} onClick={handleButtonClick}>
//         <span>
//             <Icon as={AiOutlineCloudUpload} width="20px" height="20px" mr={2} color="inherit" />
//           选择最多5张图片 {images.length}/5
//         </span>
//                 <input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     style={{display: "none"}}
//                     ref={fileInputRef}
//                     onChange={handleImageUpload}
//                 />
//             </div>
//
//             {images.length > 0 && (
//                 <div className={styles["upload-images-list"]}>
//                     {images.map((image, index) => (
//                         <div key={index} className={styles["upload-images-item-panel"]}>
//                             <img
//                                 key={index}
//                                 src={URL.createObjectURL(image)}
//                                 alt={`Image ${index + 1}`}
//                                 className={styles["upload-images-item"]}
//                             />
//                             <DeleteOutlined onClick={() => handleImageRemove(index)}/>
//                         </div>
//                     ))}
//                 </div>
//             )}
//
//         </div>
//     );
// }
//
// export default ImageUploader;


import React, { useState, useRef } from "react";
import styles from "./draw-imageuploader.module.scss";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { DeleteOutlined } from "@ant-design/icons";
import { Icon } from "@chakra-ui/react";

interface ImageUploaderProps {
    onUpload: (base64Images: string[]) => void;
    length?:number
}

export function ImageUploader(props: ImageUploaderProps) {
    const [images, setImages] = useState<File[]>([]);
    const [base64Images, setBase64Images] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, 5);
            const newImages = [...images, ...files];
            setImages(newImages);

            // Convert each file to Base64
            const base64Promises = files.map(fileToBase64);
            const newBase64Images = await Promise.all(base64Promises);

            // Append to existing base64 images state
            const updatedBase64Images = [...base64Images, ...newBase64Images];
            setBase64Images(updatedBase64Images);

            props.onUpload(updatedBase64Images);
        }
    };

    const handleImageRemove = (index: number) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);

        const updatedBase64Images = [...base64Images];
        updatedBase64Images.splice(index, 1);
        setBase64Images(updatedBase64Images);
    };

    return (
        <div className={styles["upload-container"]}>
            <div className={styles["upload-btn"]} onClick={handleButtonClick}>
                <Icon as={AiOutlineCloudUpload} width="20px" height="20px" mr={2} color="inherit" />
                <span>{`选择最多${props.length || 5}张图片 ${images.length}/${props.length || 5}`}</span>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                />
            </div>

            {images.length > 0 && (
                <div className={styles["upload-images-list"]}>
                    {images.map((image, index) => (
                        <div key={index} className={styles["upload-images-item-panel"]}>
                            <img
                                src={URL.createObjectURL(image)}
                                alt={`Image ${index + 1}`}
                                className={styles["upload-images-item"]}
                            />
                            <DeleteOutlined onClick={() => handleImageRemove(index)} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ImageUploader;
