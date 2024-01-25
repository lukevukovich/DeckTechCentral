import { Flex, Heading } from "@chakra-ui/react"
import DTCHeader from "../dtc_assets/Header"

// Dashboard/home page
export default function Dashboard() {
    return (
        <Flex direction="column">
            <DTCHeader></DTCHeader>
            <Heading padding="15px" textAlign="center">Home</Heading>
            {/* Put more components here */}
        </Flex>
    )
  }