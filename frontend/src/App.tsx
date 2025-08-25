import { useEffect } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import { Flex, Text, Button, Grid, Switch, TextArea, Card, Box } from '@radix-ui/themes';
import { useTheme } from './components/theme-context';
import './App.css';

function App() {
  // const [count, setCount] = useState(0);
  const { toggleTheme, appTheme } = useTheme();

  useEffect(() => {
    const getProxy = async () => {
      try {
        const response = await fetch('/api', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    getProxy();
  }, []);

  return (
    <Box maxWidth="900px" minWidth={'clamp(900px,80%,500px)'}>
      <Card size="2">
        <Flex direction="column" gap="3">
          <Grid gap="1">
            <Text as="div" weight="bold" size="2" mb="1">
              Feedback
            </Text>
            <TextArea placeholder="Write your feedback…" />
          </Grid>
          <Flex asChild justify="between">
            <label>
              <Text color="gray" size="2">
                Attach screenshot?
              </Text>
              <Switch
                size="1"
                checked={appTheme} // controlled by context
                onCheckedChange={(checked: boolean) => toggleTheme(checked)}
              />
            </label>
          </Flex>
          <Grid columns="3" gap="2">
            <Button variant="surface">Back</Button>
            <Button>Send</Button>
          </Grid>
        </Flex>
      </Card>
    </Box>
  );
}

export default App;
