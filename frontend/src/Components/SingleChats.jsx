import { Box, FormControl, IconButton, Spinner, Text,Input, useToast, Button } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { getSender, getSenderFull } from '../config/ChatLogic';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import  axios from 'axios'
import './styles.css'
import ScrollableChat from './ScrollableChat';

import io from 'socket.io-client'
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const [messages, setMessages] = useState([]);
    const [loading,setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState();
    const [typing, setTyping]= useState(false);
    const[isTyping,setIsTyping] = useState(false);

    const toast=useToast();
    const {user,selectedChat, setSelectedChat, notification, setNotification} = ChatState();

    const fetchMessages =async () =>{
        if(!selectedChat)
            return;
        setLoading(true);
        try {
            const config={
                headers: {
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}= await axios.get(`/api/message/${selectedChat._id}`,config);
            setMessages(data);
            setLoading(false);

            socket.emit('join chat', selectedChat._id);

        } catch (error) {
            toast({
                title: "Error Fetching Messages",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
            setLoading(false);
        }
    }
    const fetchNotifications =async () =>{
        try {
            const config={
                headers: {
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}= await axios.get(`/api/chat/notifications`,config);
            setNotification(data);

        } catch (error) {
            toast({
                title: "Error Fetching Notifications",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
        }
    }
    const updateNotifications =async () =>{
        try {
            const config={
                headers: {
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}= await axios.put(`/api/chat/notifications`,{chatId:selectedChat._id},config);

        } catch (error) {
            toast({
                title: "Error Updated Notifications",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
        }
    }

    const sendMessage= async (event)=>{
        if(event.target.value==='send' || (event.key === "Enter" && newMessage) ) {
            socket.emit('stop typing',selectedChat._id);
            try {
                const config={
                    headers: {
                        "Content-Type":"application/json",
                        Authorization:`Bearer ${user.token}`
                    }
                }
                const messageBody={
                    chatId:selectedChat._id,
                    content:newMessage
                }
                setNewMessage("");
                
                const {data}= await axios.post('/api/message/',messageBody,config);
                socket.emit("new message",data);
                setMessages([...messages,data]);
                

            } catch (error) {
                toast({
                    title: "Error Sending a Message",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                })
            }
        }
    }

    
    useEffect(()=>{
        fetchMessages();
        fetchNotifications();
        selectedChatCompare = selectedChat;
        if(selectedChat)
        {
            notification.filter(noti=>noti.chat._id!=selectedChat._id);
        }
    },[selectedChat]);
    
    //socket.io-client implementation for connection
    useEffect(()=>{
        socket= io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", (userName)=> {
            console.log(`${userName} you are connected` );
            setSocketConnected(true)
            toast({
                title: `${userName} you are connected`,
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "bottom-left",
            })
        });

        // console.log(isTyping)
        socket.on('typing',()=>setIsTyping(true));
        socket.on('stop typing',()=>setIsTyping(false));
    },[])
    
    //socket.io-client implementation for receiving messages and notifications
    useEffect(()=>{


        socket.on("message recieved", (newMessageRecieved)=>{
            if(
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageRecieved.chat._id
                ) {
                    // give notification
                    if(!notification.includes(newMessageRecieved)) {
                        setNotification([newMessageRecieved,...notification]);
                        setFetchAgain(!fetchAgain)
                    }
                } else {
                    setMessages([...messages, newMessageRecieved]);
                }
            })

        selectedChat && updateNotifications();

        })
        
        const typingHandler=(e)=>{
            setNewMessage(e.target.value);
    
            //Typing Indicator Logic
            if(!socketConnected ) return;

            if(!typing)
            {
                setTyping(true);
                socket.emit("typing", selectedChat._id);
            }

            let lastTypingTime= new Date().getTime();
            var timerLength = 3000;
            setTimeout(()=>{
                var timeNow= new Date().getTime();
                var  timeDiff= timeNow- lastTypingTime;

                if(timeDiff >= timerLength && typing) {
                    socket.emit("stop typing", selectedChat._id);
                    setTyping(false);
                }
            },timerLength);

        }
        return (
            <>
            {selectedChat?(
                <>
                    <Text
                     fontSize={{base:"28px", md:"30px"}}
                     pb={3}
                     px={2}
                     w="100%"
                     fontFamily="Work sans"
                     display="flex"
                     justifyContent={{base: "space-between"}}
                     alignItems="center"
                    >
                        <IconButton
                         d={{base:"flex", md: "none"}}
                         icon={<ArrowBackIcon/>}
                         onClick={()=>setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user,selectedChat.users)}
                                <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )}
                        
                    </Text>
                    <Box
                      display="flex"
                      flexDir="column"
                      justifyContent="flex-end"
                      p={3}
                      bg="#E8E8E8"
                      w="100%"
                      h="100%"
                      borderRadius="lg"
                      overflowY="hidden"
                    >
                        {/* Messages Here */}
                        {loading ? (
                            <Spinner
                                size="x1"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ):(
                            <div className='messages'>
                                <ScrollableChat messages={messages}/>
                            </div>
                        )}
            {isTyping?<Button color='green' fontWeight='bold' width='10%' bg='transparent' >Typing...</Button>:""}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3} display='flex'>
                            <Input
                                borderTopRightRadius='0' borderBottomRightRadius='0'
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder="Enter a Message.."
                                onChange={typingHandler}
                                value={newMessage}
                            />
                            <Button value='send' onClick={sendMessage} borderTopLeftRadius='0' borderBottomLeftRadius='0' color='rgb(35, 106, 228)'> Send</Button>
                        </FormControl>
                    </Box>
                </>
            ):(
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                        Click on a user to start Chatting
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat;