import { Flex, Heading } from "@chakra-ui/react"
import DTCHeader from "../dtc_assets/Header"

// Search result page
export default function Search() {
    return (
        <Flex direction="column">
            <DTCHeader></DTCHeader>
            <Heading padding="15px" textAlign="center">Search</Heading>
            {/* Put more components here */}
        </Flex>
    )
  }