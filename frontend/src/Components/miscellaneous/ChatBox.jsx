import React from 'react';
import {ChatState} from '../../Context/ChatProvider';
import {Box} from '@chakra-ui/react';
import SingleChat from '../SingleChats';


const ChatBox = ({fetchAgin, setFetchAgain})=>{

    const { selectedChat } = ChatState();


    return(
        <Box
         display={{base:selectedChat? "flex" : "none", md: "flex"}}
         alignItems="center"
         flexDir="column"
         p={3}
         bg="transparent"
         w={{base: "100%", md: "68%"}}
         borderRadius="lg"
         borderWidth="1px"
        >
            <SingleChat fetchAgain={fetchAgin} setFetchAgain={setFetchAgain}/>
        </Box>
    )
}

export default ChatBox;