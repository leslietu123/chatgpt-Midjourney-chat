import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Switch,
    useDisclosure
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {showToast} from "@/app/components/ui-lib";


interface SettingProps<T> {
    onSubmit?: (formData: T) => void;
    title: string;
    onChange?: () => void;
    visibleFields: (keyof T)[];
    storageKey: string;
}

export default function OwnKeySetting<T extends { [key: string]: any }>(props: SettingProps<T>) {
    const { title, visibleFields,storageKey } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);

    // 默认表单状态可以是空对象，因为字段将会动态添加
    const [formData, setFormData] = useState<T>({} as T);

    useEffect(() => {
        const storedFormData = localStorage.getItem(storageKey);
        if (storedFormData) {
            setFormData(JSON.parse(storedFormData));
        }
    }, []);

    const handleSubmit = (formData:T) => {
        localStorage.setItem(storageKey, JSON.stringify(formData));
        props.onChange && props.onChange();
        showToast('设置成功');
        onClose();
    }
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, key: keyof T) => {
        setFormData({
            ...formData,
            [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
        });
    };

    // 动态创建表单字段
    const formFields = visibleFields.map((key) => {
        const value = formData[key];
        if (key === 'active') {
            return (
                <Switch
                    key={key}
                    id={key}
                    isChecked={Boolean(value)}
                    onChange={(event) => handleInputChange(event, key)}
                    ml={3}
                />
            );
        } else {
            return (
                <FormControl mb={3} key={key.toString()}>
                    <FormLabel>{key.toString()}</FormLabel>
                    <Input
                        textAlign={"left"}
                        value={value}
                        onChange={(event) => handleInputChange(event, key)}
                    />
                </FormControl>
            );
        }
    });

    return (
        <>
            <Link color='teal.500' onClick={onOpen}>
                设置
            </Link>
            <Switch
                id='active'
                isChecked={formData.active}
                onChange={() => {
                    setFormData(prevFormData => {
                        const newFormData = {...prevFormData, active: !prevFormData.active};
                        handleSubmit(newFormData);
                        return newFormData;
                    });
                }}
                ml={3}
            />
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
                size={'xl'}
            >
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader fontSize={16}>{title}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody pb={6}>
                        {formFields}
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={onClose}>取消</Button>
                        <Button colorScheme='blue' onClick={() => handleSubmit(formData)}>
                            保存
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}


