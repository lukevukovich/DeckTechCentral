import { Flex, Heading} from "@chakra-ui/react"
import DTCHeader from "../dtc_assets/Header"
import LoginButton from "../oauth/Login"
import LogoutButton from "../oauth/Logout"

// Profile page
export default function Profile() {
    return (
        <Flex direction="column">
            <DTCHeader></DTCHeader>
            <Heading padding="15px" textAlign="center">Profile</Heading>
            <Flex alignSelf="center">
                <LoginButton></LoginButton>
                <div>&nbsp;&nbsp;</div>
                <LogoutButton></LogoutButton>
            </Flex>
            {/* Put more components here */}
        </Flex>
    )
  }