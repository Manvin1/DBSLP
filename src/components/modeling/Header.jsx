import React, { useRef, useState } from 'react';

import { Button as ChakraButton, Divider, Flex, FormLabel, IconButton, Input, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import { useActor } from '@xstate/react';
import FileSaver from 'file-saver';
import { useNavigate } from 'react-router-dom';

import { useModelingContext } from '../../contexts/ModelingContext';
import { useAppContext } from '../../contexts/global/AppContext';
import { HEADER_STATES } from '../../reducers/HeaderReducer';
import { ArrowDownIcon, DoubleArrowBottomIcon, DoubleArrowTopIcon, FileTextIcon } from '../utils/Icons';
import MachineEvents from './state/MachineEvents';
import Attribute from './types/Attribute';
import Cardinality from './types/Cardinality';
import Entity from './types/Entity';
import Generalization, { GeneralizationType } from './types/Generalization';
import Rect from './types/Rect';
import Relation from './types/Relation';
import Table from './types/Table';

/**
 * Componente que representa um Botão.
 */
function Button({ children, ...props}) {
  return (
    <ChakraButton
      bgColor='transparent'
      color='inherit'
      fontSize='inherit'
      fontWeight='normal'
      _hover={{
        bgColor: 'primaryFg'
      }}
      {...props}>
      {children}
    </ChakraButton>
  )
}

/**
 * Componente que representa um botão de navegação.
 */
function NavButton({children, ...props})
{
  return (
    <Button 
      _hover={{
        bgColor: 'secondaryFg'
      }}
      {...props}>
      {children}
    </Button>
  )
}

/**
 * Componente que representa o cabeçalho da Ferramenta de Modelagem.
 */
function Header() {
  const { 
    headerState, 
    dispatchHeaderStateAction, 
    stage, 
    toolMachineServices ,
    currentPage
  } = useModelingContext();
  const {store} = useAppContext();
  const { isOpen: isLoadModalOpen, onOpen: onLoadModalOpen, onClose: onLoadModalClose } = useDisclosure();

  const loadFileRef = useRef();
  const [fileName, setFileName] = useState();
  const navigate = useNavigate();
  const [state, send] = useActor(toolMachineServices);

  /**
   * Salvar o Canvas da Modelagem Conceitual como PNG.
   */
  async function handleConceptualPngSave()
  {
    const x = stage.x();
    const y = stage.y();
    const scale = stage.scale();
    const position = stage.position();

    let boundingBox = null;
    store.conceptual.entities.forEach(entity => {
      const entityBoundingBox = Entity.getBoundingBox(entity);
      boundingBox = Rect.getBoundingBox(boundingBox, entityBoundingBox);
    });

    store.conceptual.relations.forEach(relation => {
      let relationBoundingBox = Relation.getBoundingBox(relation);

      relation.cardinalities.forEach(cardinality => {
        const cardinalityBoundingBox = Cardinality.getBoundingBox(cardinality);
        relationBoundingBox = Rect.getBoundingBox(cardinalityBoundingBox, relationBoundingBox);
      });

      boundingBox = Rect.getBoundingBox(boundingBox, relationBoundingBox);
    });

    store.conceptual.attributes.forEach(attribute => {
      const attributeBoundingBox = Attribute.getBoundingBox(attribute);
      boundingBox = Rect.getBoundingBox(boundingBox, attributeBoundingBox);
    })

    store.conceptual.generalizations.forEach(generalization => {
      const typeLabelBoundingBox = GeneralizationType.getBoundingBox(generalization.genType);
      let generalizationBoundingBox = Generalization.getBoundingBox(generalization);

      generalizationBoundingBox = Rect.getBoundingBox(generalizationBoundingBox, typeLabelBoundingBox);
      boundingBox = Rect.getBoundingBox(boundingBox, generalizationBoundingBox);
    })

    if (!boundingBox)
    {
      return;
    }

    const config = {
      x: boundingBox.x,
      y: boundingBox.y,
      width: Math.ceil(boundingBox.w),
      height: Math.ceil(boundingBox.h),
    };

    stage.scale({ x: 1, y: 1 });
    stage.position({ x: 0, y: 0 });
    const blob = await stage.toBlob(config)

    stage.scale(scale);
    stage.position(position);

    FileSaver.saveAs(blob, 'conceptualModel.png');
  }

  /**
   * Salvar o Canvas da Modelagem Lógica como PNG.
   */
  async function handleLogicalPngSave()
  {
    const x = stage.x();
    const y = stage.y();
    const scale = stage.scale();
    const position = stage.position();

    let boundingBox = null;
    store.logical.tables.forEach(table => {
      const tableBoundingBox = Table.getBoundingBox(table);
      boundingBox = Rect.getBoundingBox(boundingBox, tableBoundingBox);
    });

    store.logical.associations.forEach(association => {
      association.cardinalities.forEach(cardinality => {
        const cardinalityBoundingBox = Cardinality.getBoundingBox(cardinality);
        boundingBox = Rect.getBoundingBox(boundingBox, cardinalityBoundingBox);
      });
    });

    if (!boundingBox)
    {
      return;
    }

    const config = {
      x: boundingBox.x,
      y: boundingBox.y,
      width: Math.ceil(boundingBox.w),
      height: Math.ceil(boundingBox.h),
    };

    stage.scale({ x: 1, y: 1 });
    stage.position({ x: 0, y: 0 });
    const blob = await stage.toBlob(config)

    stage.scale(scale);
    stage.position(position);

    FileSaver.saveAs(blob, 'logicalModel.png');
  }

  /**
   * Salvar o Canvas da Modelagem Atual como PNG.
   */
  async function handlePngSave() {
    if (currentPage === 'conceptual')
    {
      handleConceptualPngSave();
    }
    else
    {
      handleLogicalPngSave();
    }
  }

  /**
   * Salvar o estado do documento de modelagem como JSON.
   */
  function handleJSONSave() {
    const json = JSON.stringify(store);

    const blob = new Blob([json], {
      type: 'application/json'
    })

    FileSaver.saveAs(blob, 'modeling.json');
  }

  /**
   * Carregar o estado do documento de modelagem a partir de JSON.
   * @returns 
   */
  function handleFileLoad()
  {
    const fileInput = loadFileRef.current;
    const files = fileInput.files;

    if (files.length !== 1)
    {
      return;
    }

    const file = files[0];

    if(file.type !== "application/json")
    {
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', e => {
      const userStore = JSON.parse(reader.result);
      
      store.conceptual.entities = userStore.conceptual.entities;
      store.conceptual.relations = userStore.conceptual.relations;
      store.conceptual.attributes = userStore.conceptual.attributes;
      store.conceptual.generalizations = userStore.conceptual.generalizations;
      store.conceptual.connections = userStore.conceptual.connections;

      store.logical.tables = userStore.logical.tables;
      store.logical.associations = userStore.logical.associations;

      onLoadModalClose();
    });

    reader.readAsText(file);
  }

  /**
   * Navegar (client-side) para o URL específicado.
   * 
   * É sempre enviado o Evento {@link MachineEvents.CLEAR} para a State Machine.
   * @param {String} url 
   */
  function handleNavigate(url)
  {
    send({
      type: MachineEvents.CLEAR
    })
    navigate(url);
  }

  return (
    headerState === HEADER_STATES.closed ? (
      <IconButton
        borderRadius='8px'
        inset='0 0 auto auto'
        zIndex='3'
        position='absolute'
        bgColor='transparent'
        color='openMenu'
        _hover={{
          opacity: '1',
          bgColor: 'openMenuHover'
        }}
        _active={{
          transform: 'scale(.8)',
          color: 'openMenuHover',
          bgColor: 'openMenu'
        }}
        onClick={() => {
          dispatchHeaderStateAction({
            type: 'TOGGLE'
          })
        }}>
        <DoubleArrowBottomIcon boxSize='30px' />
      </IconButton>
    ) : (
      <Flex
        flexDir='column'
        bg='primary'
        color='primaryText'
        fontSize='1.6rem'
        fontFamily='secondary'>
        <Flex
          alignItems='center'
          padding='.5rem'
          gap='1em'>
          <Flex
            gap='1em'>
            <Menu>
              <MenuButton
                as={ChakraButton}
                rightIcon={<ArrowDownIcon />}
                color='primaryText'
                bgColor='transparent'
                _hover={{
                  bg: 'primaryFg'
                }}
                _expanded={{
                  bg: 'primaryFg'
                }}
                textTransform='capitalize'
                fontSize='inherit'
                fontWeight='normal'
                padding='1em .5em'>
                Arquivo
              </MenuButton>

              <MenuList color='secondaryText'>
                <MenuItem onClick={onLoadModalOpen}>
                  Carregar JSON
                </MenuItem>

                <MenuItem
                  as='div'
                  closeOnSelect={false}>
                  <Menu
                    placement='right'>
                    <MenuButton
                      as={ChakraButton}
                      padding='0'
                      bgColor='transparent'
                      _hover={{
                        bgColor: 'transparent'
                      }}
                      rightIcon={<ArrowDownIcon />}
                      textTransform='capitalize'
                      fontSize='inherit'
                      fontWeight='normal'>
                      Salvar como
                    </MenuButton>

                    <MenuList>
                      <MenuGroup title='Modelagem'>
                        <MenuItem
                          onClick={handleJSONSave}>
                          JSON
                        </MenuItem>
                      </MenuGroup>

                      <MenuDivider />

                      <MenuGroup title='Modelo Atual'>
                        <MenuItem
                          onClick={handlePngSave}>
                          PNG
                        </MenuItem>
                      </MenuGroup>
                    </MenuList>
                  </Menu>

                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>

          <Divider
            marginRight='auto'
            orientation='vertical' />
        </Flex>

        <Divider />

        <Flex
          alignItems='center'
          padding='.5rem'
          gap='1em'>
          <Flex
            alignItems='center'
            gap='1em'>
            <NavButton
              px='1em'
              bgColor={
                currentPage === 'conceptual'? 'secondaryFg' : 'transparent'
              }
              onClick={()=>{
                handleNavigate('/modelagem');
              }}>
                Conceitual
            </NavButton>
            <NavButton
              px='1em'
              bgColor={
                currentPage === 'logical'? 'secondaryFg' : 'transparent'
              }
              onClick={()=>{
                handleNavigate('/modelagem/logical');
              }}>
              Lógico
            </NavButton>
          </Flex>

          <Divider
            orientation='vertical' />

          <IconButton
            marginLeft='auto'
            bgColor='transparent'
            color='closeMenu'
            bg='transparent'
            _hover={{
              opacity: '1',
              bgColor: 'closeMenuHover'
            }}
            _active={{
              transform: 'scale(.8)',
              color: 'closeMenuHover',
              bgColor: 'closeMenu'
            }}
            onClick={() => {
              dispatchHeaderStateAction({
                type: 'TOGGLE'
              })
            }}>
            <DoubleArrowTopIcon boxSize='30px' />
          </IconButton>

        </Flex>

        <Modal isOpen={isLoadModalOpen} onClose={onLoadModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Carregar</ModalHeader>

            <ModalCloseButton />

            <ModalBody>
              <FormLabel
                display='flex'
                gap='.5em'
                alignItems='center'
                justifyContent='flex-start'
                htmlFor='fileLoad'>
                <FileTextIcon/>
                <Text>{fileName || 'Selecionar Arquivo *.json'}</Text>
              </FormLabel>
              <Input 
                display='none'
                id="fileLoad"
                ref={loadFileRef}
                onChange={(e) => {
                  const fileInput = loadFileRef.current;
                  const files = fileInput.files;
                  if (files.length)
                  {
                    setFileName(files[0].name);
                  }
                }}
                type='file'/>
            </ModalBody>

            <ModalFooter>
              <Button 
                mr={3} 
                bgColor='closeMenu'
                _hover={{
                  bgColor: 'closeMenuHover'
                }}
                onClick={onLoadModalClose}>
                Fechar
              </Button>

              <Button 
                onClick={handleFileLoad}>
                Carregar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    )
  )
}

export default Header