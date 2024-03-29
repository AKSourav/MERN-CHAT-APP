import React, { useState } from 'react';
import {Box, Tooltip, Button,Text, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Avatar, useToast, Spinner} from '@chakra-ui/react'
import {BellIcon, ChevronDownIcon} from "@chakra-ui/icons"
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import {useDisclosure} from "@chakra-ui/hooks"
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Input
  } from '@chakra-ui/react';
import axios from 'axios';
import { duration } from '@mui/material';
import ChatLoading from '../ChatLoading';
import UserListItem from './User Avatar/UserListItem';
import { getSender } from '../../config/ChatLogic';
import {Effect} from 'react-notification-badge';
import NotificationBadge from 'react-notification-badge';


const SideDrawer = ()=>{
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const Navigate= useNavigate();
    const { isOpen, onOpen, onClose} = useDisclosure();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        Navigate("/");
    };

    const toast = useToast();

    const handleSearch = async () =>{
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            
            const {data} = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch(error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
            setLoading(false);
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            };
            const {data} = await axios.post("/api/chat", {userId}, config);

            if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();

        } catch (error) {
            toast({
                title: "Error fetching the Chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
            setLoadingChat(false);
        }
    }

    return(
        <>
           <Box
             display="flex"
             justifyContent="space-between"
             alignItems="center"
             bg="white"
             w="100%"
             p="5px 10px 5px 10px"
             borderWidth="5px"
           >
                <Tooltip
                label="Search Users to chat"
                hasArrow
                placement="bottom-end"
                >
                    <Button variants='ghost' onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        <Text
                        display={{base: "none", md: "flex"}}
                        px='4'
                        >
                            Search Users
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize="2x1" fontFamily="Work Sans">
                    Chat/\App
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge 
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>

                        <MenuList pl={2}>
                            {!notification.length && "No New Messages"}
                            {notification.map((notif)=>(
                                <MenuItem key={notif._id}  onClick={()=>{
                                    setSelectedChat(notif.chat);
                                    setNotification(notification.filter((n)=>n!==notif));
                                }}>
                                    {notif.chat.isGroupChat
                                        ?`New Message in ${notif.chat.chatName}`
                                        :`New Message from ${getSender(user,notif.chat.users)}`
                                    }
                                </MenuItem>
                            ))}
                        </MenuList>

                        <Menu>
                            <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon/>}
                            >
                                <Avatar
                                    size="sm"
                                    cursor='pointer'
                                     name={user.name} 
                                     src={user.pic}
                                    />  
                            </MenuButton>
                            <MenuList>
                                <ProfileModal user={user}>
                                    <MenuItem>My Profile</MenuItem>
                                </ProfileModal>
                                <MenuDivider/>
                                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                            </MenuList>
                        </Menu>
                    </Menu>
                </div>
           </Box> 

            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input
                            placeholder="Search by name or email"
                            mr={2}
                            value={search}
                            onChange={(e)=>setSearch(e.target.value)}
                            />
                            <Button
                             onClick={handleSearch}
                            >
                                Go
                            </Button>
                        </Box>
                        {loading ? (
                            <ChatLoading/>
                        ) : (
                            searchResult?.map(user => (
                                <UserListItem
                                  key={user._id}
                                  user={user}
                                  handleFunction={()=>accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadingChat && <Spinner m1="auto" d="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

        </>
    )
}

export default SideDrawer;