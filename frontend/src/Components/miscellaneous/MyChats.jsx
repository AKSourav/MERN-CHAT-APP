import { Box, Button, useToast,Stack,Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from '../ChatLoading';
import { getSender } from '../../config/ChatLogic';
import GroupChatModal from './GroupChatModal';

const MyChats = ({fetchAgain})=>{
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

    const toast = useToast();

    const fetchChats = async () => {
        try{
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const {data} = await axios.get("/api/chat", config);
            setChats(data);
        } catch (error) {
            toast({
                title: "Error fetching the Chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
        }
    }
    useEffect(()=>{
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    },[fetchAgain]);
    return(
        <Box
          display={{base: selectedChat?"none":"flex", md:"flex"}}
          flexDir="column"
          alignItems="center"
          p={3}
          bg="white"
          w={{base: "100%", md:"31%"}}
          borderRadius="lg"
          borderWidth="lpx"
        >
            <Box
              pb={3}
              px={3}
              fontSize={{base:"28px", md: "30px"}}
              fontFamily="Work sans"
              display="flex"
              w="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              My Chats
              <GroupChatModal>
                <Button
                    display="flex"
                    fontSize={{base:"17px", md:"10px",lg:"17px"}}
                    rightIcon={<AddIcon/>}
                >
                    New Group Chat
                </Button>
              </GroupChatModal>
            </Box>

            <Box
              display="flex"
              flexDir="column"
              p={3}
              bg="#F8F8F8"
              w="100%"
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
            >

                {chats? (
                    <Stack  overflowY='scroll'>
                        {chats.map((chat)=>(
                            <Box
                             onClick={()=>setSelectedChat(chat)}
                             cursor="pointer"
                             bg={selectedChat===chat?"#38B2AC" : "#E8E8E8"}
                             color={selectedChat===chat?"white" : "black"}
                             px={3}
                             py={2}
                             borderRadius="lg"
                             key={chat._id}
                            >
                                <Text>
                                    {!chat.isGroupChat
                                    ? getSender(user,chat.users)
                                    : chat.chatName}
                                </Text>
                                {
                                    chat.latestMessage?
                                    (<Text fontSize="1.8vh">
                                        <span style={{fontWeight:"bold"}}>{chat.latestMessage.sender.name}</span>:{chat.latestMessage.content}
                                    </Text>)
                                    :""
                                }   
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    
                    <ChatLoading/>
                )}
            </Box>
        </Box>
    )
}

export default MyChats;