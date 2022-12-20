import { Container, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Header } from "../components";

const Root = () => {
  return (
    <Flex minH="100vh" direction="column">
      <Header />

      <Container as="main" maxW="container.lg" flex={1} mt={24} p={4}>
        <Outlet />
      </Container>
    </Flex>
  );
};

export default Root;
