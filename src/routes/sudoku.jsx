import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  GridItem,
  SimpleGrid,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import { useState } from "react";
import CSP from "../utils/CSP";

const SIZE = 9;
const BLOCK_SIZE = Math.sqrt(SIZE) | 0;
const initialFilled = {};

const initialData = [];
initialData.forEach((item) => (initialFilled[item[0]] = item[1]));

const Sudoku = () => {
  const [filled, setFilled] = useState(initialFilled);
  const [result, setResult] = useState({});
  const [selectedCell, setSelectedCell] = useState([]);

  const solve = () => {
    const csp = new CSP();

    const sudoku = {};
    const domain = [];
    const variables = {};
    const constraints = [];

    for (let i = 1; i <= SIZE; i++) {
      domain.push(i);
    }

    const notEq = (a, b) => {
      return a !== b;
    };

    for (let i = 1; i <= SIZE; i++) {
      for (let j = 1; j <= SIZE; j++) {
        let fi = filled[[i, j]];
        variables[[i, j]] = fi ? [fi] : domain.slice();

        // Horizontal and vertical constraints
        for (let k = 1; k <= SIZE; k++) {
          if (notEq(i, j)) {
            constraints.push([[i, k], [j, k], notEq]);
            constraints.push([[k, i], [k, j], notEq]);
          }
        }

        // Block constraints
        let h = ((j - 1) / BLOCK_SIZE) | 0;
        let v = ((i - 1) / BLOCK_SIZE) | 0;

        for (let k = v * BLOCK_SIZE; k < (v + 1) * BLOCK_SIZE; k++) {
          for (let m = h * BLOCK_SIZE; m < (h + 1) * BLOCK_SIZE; m++) {
            if (notEq(i, k + 1) || notEq(j, m + 1)) {
              constraints.push([[k + 1, m + 1], [i, j], notEq]);
            }
          }
        }
      }
    }

    sudoku.variables = variables;
    sudoku.constraints = constraints;

    const result = csp.solve(sudoku);

    setResult(result);
  };

  const reset = () => {
    setResult({});
    setFilled({});
    setSelectedCell([]);
  };

  return (
    <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={4}>
      <GridItem>
        <TableContainer>
          <Table variant="unstyled" backgroundColor="gray.50">
            <Tbody>
              {Array.from({ length: SIZE }).map((_, i) => (
                <Tr key={`row-${i + 1}`}>
                  {Array.from({ length: SIZE }).map((_, j) => (
                    <Box
                      as="td"
                      key={`row-column-${j + 1}`}
                      boxSize={16}
                      border="2px"
                      borderColor="gray.400"
                      borderBottomColor={
                        (i + 1) % BLOCK_SIZE === 0 ? "gray.700" : 0
                      }
                      borderRightColor={
                        (j + 1) % BLOCK_SIZE === 0 ? "gray.700" : 0
                      }
                      backgroundColor={
                        selectedCell[0] === i + 1 && selectedCell[1] === j + 1
                          ? "blue.200"
                          : undefined
                      }
                      cursor="pointer"
                      userSelect="none"
                      onClick={() => setSelectedCell([i + 1, j + 1])}
                      onContextMenu={(event) => {
                        event.preventDefault();
                        setSelectedCell([]);
                      }}
                    >
                      <Text color="gray.800" fontSize="4xl" align="center">
                        {result[[i + 1, j + 1]] || filled[[i + 1, j + 1]]}
                      </Text>
                    </Box>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </GridItem>

      <GridItem>
        <Stack spacing={4}>
          <SimpleGrid columns={3}>
            {Array.from({ length: 9 }).map((_, i) => (
              <Button
                key={`button-${i}`}
                size="lg"
                variant="ghost"
                fontSize="2xl"
                onClick={() =>
                  setFilled((prevState) => ({
                    ...prevState,
                    [selectedCell]: i + 1,
                  }))
                }
              >
                {i + 1}
              </Button>
            ))}
          </SimpleGrid>

          <ButtonGroup alignSelf="center">
            <Button size="lg" colorScheme="blue" onClick={() => solve()}>
              Solve
            </Button>

            <Button size="lg" colorScheme="red" onClick={() => reset()}>
              Reset
            </Button>
          </ButtonGroup>
        </Stack>
      </GridItem>
    </Grid>
  );
};

export default Sudoku;
