import { useDisclosure, Box, useToast,Modal, ModalOverlay, ModalContent,ModalHeader, ModalBody, ModalCloseButton, ModalFooter,Button, FormControl, Input } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import React, { useState } from 'react'
import axios from 'axios';
import UserListItem from './User Avatar/UserListItem';
import UserBadgeItem from './User Avatar/UserBadgeItem';

const GroupChatModal = ({children})=>{
    const {isOpen,onOpen, onClose} = useDisclosure();
    const [groupChatName,setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading,setLoading] = useState(false);
    
    const toast= useToast();

    const {user,setChats,chats} = ChatState();
    const handleSearch=async (query)=>{
        setSearch(query);
        if(!query) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const {data} = await axios.get(`/api/user?search=${query}`,config);
            console.log(data);
            setSearchResult(data);
            setLoading(false);

        } catch(error) {
            toast({
                title: "Error fetching the Chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
            setLoading(false);
        }
    }
    const handleSubmit=async ()=>{
        if(!groupChatName || !selectedUsers)
        {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.post("/api/chat/group",{
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u)=>u._id)),
            },config);

            setChats([data,...chats]);
            onClose();
            toast({
                title: "New  Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });

        } catch (error) {
            toast({
                title: "Error Ocurred!",
                description:error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
        }
    }

    const handleDelete=(delUser)=>{
        setSelectedUsers(selectedUsers.filter(sel=> sel._id!==delUser._id));
    }
    const handleGroup=(userToAdd)=>{
        if(selectedUsers.includes(userToAdd)) {
            toast({
                title: "User Already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    }
    return(
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center ">
                        <FormControl>
                            <Input
                             placeholder="Chat Name"
                             mb={3}
                             onChange={(e)=> setGroupChatName(e.target.value)}
                             />
                        </FormControl>
                        <FormControl>
                            <Input
                             placeholder="Add Users eg: John, piyush, Jane"
                             mb={1}
                             onChange={(e)=> handleSearch(e.target.value)}
                             />
                        </FormControl>
                        <Box w="100%" display="flex" flexWrap="wrap">
                            {selectedUsers.map(u => (
                                <UserBadgeItem key={user._id}
                                    user={u}
                                    handleFunction={()=> handleDelete(u)}
                                />
                            ))}
                        </Box>


                        {loading ? <div>loading</div> : (
                            searchResult?.slice(0,4).map(user => (
                                <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}

export default GroupChatModal;
