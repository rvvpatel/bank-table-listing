import "./App.css";
import store from "./redux/store";
import { Provider } from "react-redux";
import Routes from "./routes";
import theme from "./contants/theme";
import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";
function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Routes />
          </ThemeProvider>
        </StyledEngineProvider>
      </Provider>
    </div>
  );
}

export default App;
