import React, { useEffect } from "react";
import Login from "../Components/Authentication/Login";
import Signup from "../Components/Authentication/Signup";
import { Container, Box, Text,Tabs,Tab, TabList,TabPanel,TabPanels } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"

const Homepage = () => {
    const Navigate = useNavigate();

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if(user) Navigate("/chats");
    }, [Navigate]);


    return (
        <Container  maxW='xl' centerContent>
            <Box
                d='flex'
                justifyContent='center'
                textAlign="center"
                p={3}
                bg={'transparent'}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text fontSize="4xl" fontFamily="Work sans" color="black" >
                    CHAT/\APP
                </Text>
            </Box>
            <Box bg="transparent" w="100%" p={4} borderRadius="lg" borderWidth="1px" textColor="black">
                <Tabs variant='soft-rounded' >
                    <TabList>
                        <Tab width="50%">Login</Tab>
                        <Tab width="50%">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login/> 
                        </TabPanel>
                        <TabPanel>
                            <Signup/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
};

export default Homepage;
//anupamsony32
//APsGg3cV5vIBJ35M