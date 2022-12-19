import { Box, Button, Container, Stack } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <Box as="header" pos="fixed" top={0} zIndex={100} w="full">
      <Container
        maxW="container.md"
        display="flex"
        justifyContent="center"
        alignItems="center"
        py={{ base: 2, md: 4 }}
        backdropFilter="blur(10px)"
      >
        <Stack as="nav" direction="row">
          <NavLink to="/">
            {({ isActive }) => (
              <Button
                size="lg"
                colorScheme="blue"
                variant={isActive ? "solid" : "ghost"}
              >
                Sudoku
              </Button>
            )}
          </NavLink>

          <NavLink to="/map-coloring">
            {({ isActive }) => (
              <Button
                size="lg"
                colorScheme="blue"
                variant={isActive ? "solid" : "ghost"}
              >
                Map coloring
              </Button>
            )}
          </NavLink>
        </Stack>
      </Container>
    </Box>
  );
};

export default Header;
