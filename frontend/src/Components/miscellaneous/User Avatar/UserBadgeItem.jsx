import { CloseButton, Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem =({user, handleFunction})=>{
    return (
        <Box
            display="flex"
            px={2}
            py={1}
            borderRadius= "lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            backgroundColor="purple"
            color="white"
            cursor="pointer"
        >
            {user.name}
            <CloseButton pl={1} 
            onClick={handleFunction}/>
        </Box>
    )
}

export default UserBadgeItem;