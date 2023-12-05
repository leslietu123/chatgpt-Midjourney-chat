import {Feature, Prompt} from "@/app/api/back/types";
import {
    AbsoluteCenter,
    Box,
    Button, Center,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    flexbox,
    Grid,
    GridItem,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    SimpleGrid,
    useDisclosure
} from "@chakra-ui/react";
import React from "react";
import {promptGen} from "@/app/api/backapi/types";
import {zIndexOptions} from "@hello-pangea/dnd/src/view/draggable/get-style";
import {useMobileScreen} from "@/app/utils";

interface RightDrawerProps {
    total?: number;
    prompts?: Prompt[];
    featureList?: Feature[];
    selectedFeature?: Feature;
    selectedPrompt?: Prompt[];
    handleFetchPromptList: (id: string) => void;
    handleSelectPrompt: (id: string) => void;
    handleWeightChange: (id: string, weight: string) => void;
    handleDeletePrompt: (id: string) => void;
    prompt: promptGen;
}

export default function RightDrawer(props: RightDrawerProps) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const isMobileScreen = useMobileScreen();


    return (
        <>
            <Button
                onClick={onOpen}
                m={2}
                px={2}
                py={0}
                fontSize='12'
                height={6}
            >提示词存储库</Button>

            <Drawer closeOnEsc={true} onClose={onClose} isOpen={isOpen} size='xl'>
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerCloseButton/>
                    <DrawerHeader>提示词库</DrawerHeader>
                    <DrawerBody>
                        <Grid templateColumns={isMobileScreen ? 'repeat(3, 1fr)' : 'repeat(12, 1fr)'} gap={3}>
                            {props.featureList && props.featureList?.length > 0 && props.featureList?.map((item, index) => {
                                return (
                                    <GridItem
                                        onClick={() => {
                                            props.handleFetchPromptList(item._id);
                                        }}
                                        key={index}
                                        w='100%'
                                        h='8'
                                        display={'flex'}
                                        justifyContent={"center"}
                                        alignItems='center'
                                        fontSize={13}
                                        bg={props.selectedFeature?._id === item._id ? 'gray.100' : 'brand.500'}
                                    >
                                        {item.name}
                                    </GridItem>
                                )
                            })}
                        </Grid>
                        <Box position='relative' padding='10'>
                            <Divider/>
                            <AbsoluteCenter bg='white' px='4'>
                                {props.selectedFeature?.name ? `${props.selectedFeature?.name}(${props.total})` : `请选择一个特征`}
                            </AbsoluteCenter>
                        </Box>
                        <SimpleGrid columns={[2, null, 6]} gap={1}>
                            {props.prompts && props.prompts.length > 0 && props.prompts?.map((item, index) => {
                                return (
                                    <Box
                                        key={index}
                                        bgImage={item.imageUrl}
                                        bgSize="cover"
                                        height="120px"
                                        position="relative"
                                        display={"flex"}
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        borderRadius={"5px"}
                                        boxSizing="border-box"
                                        border={props.selectedPrompt?.some(prompt => prompt._id === item._id) ? '3px solid #27e600;' : '0px solid #27e600;'}
                                        onClick={() => {
                                            if (props.selectedPrompt?.some(prompt => prompt._id === item._id)) {
                                                props.handleDeletePrompt(item._id);
                                            } else {
                                                props.handleSelectPrompt(item._id);
                                            }
                                        }}
                                    >
                                        <Box
                                            position="absolute"
                                            top={0}
                                            left={0}
                                            width="100%"
                                            height="100%"
                                            bg="rgba(0, 0, 0, 0.5)"
                                            borderRadius={"5px"}
                                        />
                                        <Box
                                            display='flex'
                                            flexDirection={"column"}
                                            justifyContent={"center"}
                                            alignItems={"center"}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                            }}
                                        >
                                            <span
                                                style={{
                                                    position: "relative",
                                                    zIndex: 1,
                                                    color: "#fff",
                                                    fontSize: "12px",
                                                    fontWeight: "bold",
                                                }}
                                            >{item.question}</span>
                                            {props.prompt.selectedPrompt?.some(prompt => prompt._id === item._id) && (
                                                <Box
                                                    display={"flex"}
                                                    alignItems={"center"}
                                                    justifyContent={"center"}
                                                    marginTop={"5px"}
                                                >
                                                <span style={{
                                                    position: "relative",
                                                    zIndex: 1,
                                                    color: "#fff",
                                                    fontSize: "12px",
                                                    fontWeight: "bold",
                                                    marginRight: '3px'
                                                }}>
                                                权重:
                                                </span>
                                                    <NumberInput
                                                        borderRadius={5}
                                                        defaultValue={props.prompt.selectedPrompt?.find(prompt => prompt._id === item._id)?.weight || 0}
                                                        min={0}
                                                        max={20}
                                                        width={20}
                                                        size={'xs'}
                                                        onChange={(value) => {
                                                            props.handleWeightChange(item._id, value);
                                                        }}>
                                                        <NumberInputField/>
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper
                                                                bg='green.200'
                                                                _active={{bg: 'green.300'}}
                                                                /* eslint-disable-next-line react/no-children-prop */
                                                                children='+'
                                                            />
                                                            <NumberDecrementStepper
                                                                bg='pink.200'
                                                                _active={{bg: 'pink.300'}}
                                                                /* eslint-disable-next-line react/no-children-prop */
                                                                children='-'
                                                            />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                )
                            })}
                        </SimpleGrid>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}
