import { Flex } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";

import GlobalContext from "../contexts/global/GlobalContext";
import Home from "../pages/home/Home";
import Lab from "../pages/lab/Lab";
import Modeling from "../pages/modeling/Modeling";
import "./App.css";
import ContextManager from "./ContextManager";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

/**
 * Componente que representa a aplicação.
 */
function App() {
  return (
    <GlobalContext>
      <ContextManager>
        <Flex 
          direction='column'
          h='100vh'>
          <Flex
            flexGrow='1'>
            <Sidebar/>
            <Routes>
              <Route path='/*' Component={Home} />
              <Route path='/modelagem/*' Component={Modeling} />
              <Route path='/lab' Component={Lab} />
            </Routes>
          </Flex>
          
          <Footer />
        </Flex>
      </ContextManager>
    </GlobalContext>
  );
}

export default App
