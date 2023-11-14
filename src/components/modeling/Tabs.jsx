import React from 'react';

import { Tab as ChakraTab } from '@chakra-ui/react';

import { Route, Routes } from 'react-router-dom';
import ConceptualTabs from './ConceptualTabs';
import LogicalTabs from './LogicalTabs';

/**
 * Componente que representa um Tab.
 */
export function Tab({children, variant})
{
  let style;

  switch(variant)
  {
    case 'vertical': {
      style = {
        minWidth: 'min-content',
        writingMode: 'vertical-lr'
      };
      break;
    }
    case 'horizontal': {
      style = {
        writingMode: 'horizontal-tb'
      };
      break;
    }
    default: {
      style = {};
      break;
    }
  }
  return (
    <ChakraTab
    padding='1em'
    sx={style}
    width='fit-content'
    _selected={{
      bg: 'secondaryFg'
    }} >
      {children}
    </ChakraTab>
  )
}

/**
 * Função que trata eventos de scroll.
 * 
 * @param {Event} e 
 */
export function handleScroll(e)
{
  e.currentTarget.scrollBy(0, e.deltaY/4);
}

/**
 * Componente que representa as Tabs das ferramentas do modelo conceitual ou lógico.
 */
function Tabs() {

  return (
    <Routes>
      <Route index path='/conceptual?' element={<ConceptualTabs/>} />
      <Route path='/logical' element={<LogicalTabs />} />
    </Routes>
  )
}

export default Tabs