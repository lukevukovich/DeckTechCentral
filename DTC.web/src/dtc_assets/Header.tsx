import { Flex, Box, Heading, Avatar } from "@chakra-ui/react"
import { FaHome, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import logo from "../img/dtc_logo.png"
import "./Color"
import DTCSearchBar from "./SearchBar"
import { accent_color, primary_color, secondary_color } from "./Color"

// Standard header setup
const DTCHeader = ({}) => {
    return (
      <Flex width="100%" align="center" bgColor={primary_color} boxShadow="0px 5px 8px rgba(0, 0, 0, 0.4)">
        <Box mr={4} w="170px" pt="15px" pl="15px" pb="15px">
          <Link to="/">
            <img src={logo}/>
          </Link>
        </Box>
        <Heading pb="5px" fontSize="35px" color={secondary_color}>DeckTechCentral</Heading>
        <DTCSearchBar></DTCSearchBar>
        <Flex align="center" pr="25px">
          <Link to="/">
          <Avatar mr="20px" as={FaHome} bg="none" boxSize="32px" _hover={{color: accent_color}}></Avatar>
          </Link>
          <Link to="/profile">
            <Avatar as={FaUser} bg="none" boxSize="30px" _hover={{color: accent_color}}></Avatar>
          </Link>
        </Flex>
      </Flex>
    )
  }

export default DTCHeader