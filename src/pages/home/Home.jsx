import React from 'react';

import { Box, Flex } from '@chakra-ui/react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Header from '../../components/home/Header';
import Markdown from '../../components/utils/Markdown';
import PDF from '../../components/utils/PDF';
import HomeContextProvider, { PAGES } from '../../contexts/HomeContext';
import { useAppContext } from '../../contexts/global/AppContext';

/**
 * Componente que representa uma Rota para um arquivo Markdown.
 * 
 * @param {*} pageDetails 
 * @param {*} deviceType 
 * @returns {React.JSX.Element}
 */
function RouteMarkdown(pageDetails, deviceType)
{
  return (
    <Route 
    index={pageDetails.isIndex} 
    path={pageDetails.path} key={pageDetails.id} 
    element={
      <Box
        overflowY='scroll'
        h='100%'>
        <Box
          margin='1em 2em 0 2em'>
                <Markdown variant={deviceType}>
                {pageDetails.data}
            </Markdown>
        </Box>
      </Box>
    } />
  );
}

/**
 * Componente que representa uma Rota para um arquivo PDF.
 * 
 * @param {*} pageDetails 
 * @returns {React.JSX.Element}
 */
function RoutePDF(pageDetails)
{
  return (
    <Route 
      index={pageDetails.isIndex} 
      path={pageDetails.path} key={pageDetails.id} 
      element={
        <Box
          w='90%'
          margin='1em auto 0 auto'
          h='calc(100% - 2em)'>
        <PDF name={pageDetails.fileName} path={pageDetails.data}/>
        </Box>
      } />
  );
}

/**
 * Componente que representa a aplicação 'Home'.
 */
function Home() {
  const {
    deviceInfo: {deviceType}
  } = useAppContext();

  return (
    <HomeContextProvider>
      <Flex 
        bgColor='bgColor'
        fontFamily='primary'
        flexBasis='0'
        flexGrow='1'
        flexDirection='column'
        overflow='hidden'>
        <Header/>

        <Box 
          as='main' 
          flexBasis='0'
          flexGrow='1'
          overflow='hidden'>
          <Routes>
            {
              PAGES.map(pageDetails => (
                  pageDetails.type === 'markdown'? (
                    RouteMarkdown(pageDetails, deviceType)
                  ) : pageDetails.type === 'pdf'? (
                    RoutePDF(pageDetails)
                  ) : undefined
              ))
            }
            <Route path='/*' element={<Navigate to="/"/>}/>
          </Routes>
        </Box>
      </Flex>
    </HomeContextProvider>
  )
}

export default Home