import { InputLeftElement, Icon, Input, InputGroup } from "@chakra-ui/react"
import { SearchIcon } from '@chakra-ui/icons'
import { useNavigate } from "react-router-dom"
import { useState, KeyboardEvent } from "react"
import "./Color"
import { accent_color } from "./Color"

// Search bar setup and functionality
const DTCSearchBar = ({}) => {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState("");

    // Navigate to search page and add search value to URL
    const handleSearchEvent = (searchText: string) =>  {
      if (searchText != "") {
        navigate(`/search?q=${searchText}`)

        setSearchValue("")
      }
    }

    // If Enter is pressed, handle search event
    const handleEnterPressed = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key == "Enter") {
        handleSearchEvent(searchValue);
      }
    }

    return (
    <InputGroup pb="17px" pl="23px" alignContent="right" mt={4}>
        <InputLeftElement pl="45px" children={<Icon as={SearchIcon} onClick={() => handleSearchEvent(searchValue)} color="white" _hover={{color: accent_color}} style={{cursor: 'pointer'}}/>} />
        <Input focusBorderColor={accent_color} width="450px" type="text" placeholder="Search Deck list..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} onKeyDown={handleEnterPressed} color="white"/>
    </InputGroup>
    )
  }

export default DTCSearchBar