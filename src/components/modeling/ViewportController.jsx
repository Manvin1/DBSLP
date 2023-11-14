import React from 'react';

import { IconButton as ChakraIconButton, Flex } from '@chakra-ui/react';

import { ArrowBottomSIcon, ArrowLeftSIcon, ArrowRightSIcon, ArrowTopSIcon, MinusIcon, PlusIcon } from '../utils/Icons';

const SCALE_AMOUNT = 0.05;
const MOVE_AMOUNT = 10;

/**
 * Componente que representa um botão.
 */
function IconButton({children, ...props})
{
  return (
    <ChakraIconButton
      color='inherit'
      bgColor='primaryFg'
      opacity='.3'
      _hover={{
        opacity: '1'
      }}
      pointerEvents={'auto'}
      {...props}
      >
      {children}
    </ChakraIconButton>
  )
}

/**
 * Componente que representa um conjunto de botões para controlar a câmera do viewport de modelagem.
 */
function ViewportController({stageRef}) {

  return (
    <Flex
      inset='auto 0 0 auto'
      padding='1em'
      position='absolute'
      color='primaryText'
      alignItems='center'
      pointerEvents={'none'}
      gap='1em'>
      <Flex gap='1em'>
        <IconButton
          onClick={(e) => {
            const stage = stageRef.current;
            stage.scale({x: stage.scaleX() + SCALE_AMOUNT, y: stage.scaleY() +SCALE_AMOUNT});
          }}>
          <PlusIcon/>
        </IconButton>

        <IconButton
          onClick={(e) => {
            const stage = stageRef.current;
            stage.scale({x: stage.scaleX() - SCALE_AMOUNT, y: stage.scaleY() - SCALE_AMOUNT});
          }}>
          <MinusIcon/>
        </IconButton>
      </Flex>

      <Flex 
        alignItems='center'
        flexDir='column'
        gap='.5em'>
          <IconButton
            onClick={(e) => {
            const stage = stageRef.current;
            const {x, y} = stage.position();
            stage.position({x , y: y + MOVE_AMOUNT});
          }}>
          <ArrowTopSIcon/>
        </IconButton>

        <Flex gap='1em' justifyContent='space-between'>
          <IconButton
            onClick={(e) => {
            const stage = stageRef.current;
            const {x, y} = stage.position();
            stage.position({x: x + MOVE_AMOUNT, y});
          }}>
            <ArrowLeftSIcon/>
          </IconButton>
          <IconButton            
          onClick={(e) => {
            const stage = stageRef.current;
            const {x, y} = stage.position();
            stage.position({x: x - MOVE_AMOUNT, y});
          }}>
            <ArrowRightSIcon/>
          </IconButton>
        </Flex>

        <IconButton
            onClick={(e) => {
            const stage = stageRef.current;
            const {x, y} = stage.position();
            stage.position({x , y: y - MOVE_AMOUNT});
          }}>
          <ArrowBottomSIcon/>
        </IconButton>
      </Flex>
    </Flex>
  )
}

export default ViewportController