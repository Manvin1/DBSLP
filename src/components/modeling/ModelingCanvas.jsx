import React, { useEffect, useRef, useState } from 'react';

import { Box } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';

import { useModelingContext } from '../../contexts/ModelingContext';
import { useAppContext } from '../../contexts/global/AppContext';
import Loading from '../utils/Loading';
import LoadingAware from '../utils/LoadingAware';
import LoadingState from '../utils/LoadingState';
import ReadyState from '../utils/ReadyState';
import ConceptualModel from './ConceptualModel';
import LogicalModel from './LogicalModel';

/**
 * Componente que representa a seção de diagramação (Canvas) das ferramentas de modelagem conceitual e lógica.
 */
function ModelingCanvas() {
  const {sidebarState} = useAppContext();
  const {headerState} = useModelingContext();

  const [sectionSize, setSectionSize] = useState();
  const sectionRef = useRef();

  useEffect(() => {
    const target = sectionRef.current;
    setSectionSize({width: target.clientWidth, height: target.clientHeight});
  }, [sectionRef.current, sidebarState, headerState]);
  
  useEffect(() => {
    function handleResize()
    {
      const target = sectionRef.current;
      setSectionSize({width: target.clientWidth, height: target.clientHeight});
    }

    handleResize();
    document.addEventListener('resize', handleResize);

    return () => {document.removeEventListener('resize', handleResize)};
  }, []);
  
  return (
    <Box 
      ref={sectionRef}
      as='section'
      overflow='hidden'
      bgColor='bgColor'
      position='relative'
      flex='5'>
      <LoadingAware state={sectionSize? 'ready' : 'loading'}>
        <LoadingState>
          <Loading/>
        </LoadingState>

        <ReadyState>
          <Routes>
            <Route path='/conceptual?' element={<ConceptualModel size={sectionSize}/>} />
            <Route path='/logical' element={<LogicalModel size={sectionSize}/>} />
          </Routes>
        </ReadyState>
      </LoadingAware>
      
    </Box>
  )
}

export default ModelingCanvas