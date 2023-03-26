import { Box, IconButton, Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import React from 'react';
import { ChatState } from '../Context/ChatProvider';
import { getSender, getSenderFull } from '../config/ChatLogic';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';

const SingleChat = ({fetchAgin, setFetchAgain}) => {

    const {user,selectedChat, setSelectedChat} = ChatState();
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
                                    fetchAgin={fetchAgin}
                                    setFetchAgain={setFetchAgain}
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
                    </Box>
                </>
            ):(
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                        Click on auser to start Chatting
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat;