import React from 'react';

import { IconButton } from '@chakra-ui/react';

import { Route, Routes } from 'react-router-dom';
import ConceptualTools from './ConceptualTools';
import LogicalTools from './LogicalTools';

export const ICON_SIZE = '20px';

/**
 * Componente que representa um botão de ferramenta.
 */
export function ToolButton({ children, isSelected = false, ...props }) {
  if (isSelected) {
    return (
      <IconButton
        bgColor='primaryFg'
        color='inherit'
        {...props}>
        {children}
      </IconButton>
    )
  }

  return (
    <IconButton
      bgColor='transparent'
      color='inherit'
      {...props}>
      {children}
    </IconButton>
  )
}

/**
 * Componente que representa a seção de ferramentas da Ferramenta de modelagem conceitual ou lógica.
 */
function Tools() {
  return (
    <Routes>
      <Route path='/conceptual?' Component={ConceptualTools} />
      <Route path='/logical' Component={LogicalTools} />
    </Routes>
  )
}

export default Tools