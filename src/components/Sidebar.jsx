import React, { useRef, useState } from 'react'

import { Box, Button, Link as ChakraLink, Flex, FormLabel, IconButton, Input, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, UnorderedList, useDisclosure } from '@chakra-ui/react'
import FileSaver from 'file-saver'
import { NavLink } from 'react-router-dom'

import { useDBMSContext } from '../contexts/DBMSContext'
import { useAppContext } from '../contexts/global/AppContext'
import { SIDEBAR_STATES } from '../reducers/sidebarReducer'
import { DatabaseIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon, FileDatabaseIcon, HomeIcon, LabIcon, ModelingIcon, NetworkIcon, SeparatorIcon, ToolsIcon } from './utils/Icons'
import Scrollbars from './utils/Scrollbars'

const ROUTES =[
  {
    id: 0, 
    icon: HomeIcon, 
    path: '/', 
    title: 'Início'
  },
  {
    id: 1, 
    icon: ModelingIcon, 
    path: '/modelagem', 
    title: 'Modelagem'
  },
  {
    id: 2, 
    icon: LabIcon, 
    path: '/lab', 
    title: 'Bancada de Trabalho'
  },
]

const ICON_SIZE = '30px';

/**
 * Componente que representa uma barra lateral.
 */
function Sidebar() {
  const {
    sidebarState, dispatchSideBarStateAction,
    deviceInfo: {isDeviceThisType}
  } = useAppContext();
  const {dbServices} = useDBMSContext();
  const {storeServices} = useAppContext();

  const { isOpen: isDBSettingsOpen, onOpen: onDBSettingsOpen, onClose: onDBSettingsClose } = useDisclosure();
  const { isOpen: isRoomSettingsOpen, onOpen: onRoomSettingsOpen, onClose: onRoomSettingsClose } = useDisclosure();

  const loadFileRef = useRef();
  const [fileName, setFileName] = useState();

  const sessionTokenRef = useRef();

  const SERVICES = [
    {
      id: 0, 
      icon: NetworkIcon, 
      title: 'Gerenciador de sessões',
      onClick: onRoomSettingsOpen,
    },
    {
      id: 1, 
      icon: DatabaseIcon, 
      title: 'Banco de dados',
      onClick: onDBSettingsOpen,
    },
  ];

  /**
   * Exportar o estado atuald o banco de dados como BINARY.
   */
  function handleDatabaseSave()
  {
    if (dbServices.isDBMSRunning)
    {
      const dbFile = dbServices.exportDB();

      FileSaver.saveAs(new Blob([dbFile]), 'database.bin', {type: 'application/octet-stream'});
    }
  }

  /**
   * Carregar o banco de dados a partir de um arquivo binário.
   */
  function handleDatabaseLoad()
  {
    const fileInput = loadFileRef.current;
    const files = fileInput.files;

    if (files.length !== 1)
    {
      return;
    }

    const file = files[0];

    if(file.type !== "application/octet-stream")
    {
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', e => {
      const arrayBuffer = reader.result;
      dbServices.loadDBFromFile(new Uint8Array(arrayBuffer));
      setFileName('');
      onDBSettingsClose();
    });

    reader.readAsArrayBuffer(file);
  }

  /**
   * Conectar na Sala especificada pelo usuário.
   */
  function handleConnectToRoom()
  {
    const token = sessionTokenRef.current.value;
    storeServices.connectToSession(token);
    sessionTokenRef.current.value='';
  }

  return (
    sidebarState === SIDEBAR_STATES.closed ? (
      <IconButton
        borderRadius='8px'
        zIndex='3'
        position='absolute'
        alignSelf='flex-end'
        opacity='0.4'
        color='openMenu'
        bg='transparent'
        _hover={{
          opacity:'1',
          bgColor: 'openMenuHover'
        }}  
        _active={{
          transform: 'scale(.8)',
          color: 'openMenuHover',
          bgColor: 'openMenu'
        }}
        onClick={() => {dispatchSideBarStateAction({
          type: 'TOGGLE_OPENED_COLLAPSED'
        })}}>
        <DoubleArrowRightIcon 
          boxSize={ICON_SIZE}/>
      </IconButton>
    ) : (
      <Flex 
      as='aside'
      direction='column'
      alignItems='center'
      w='min-content'
      bg='bgColor'
      borderRight='1px solid black'
      paddingX='1em'
      paddingBottom='.5em'>
        <Flex 
          as='section'
          h='70px'
          alignItems='center'
          justifyContent='center'>
            <IconButton
              bgColor='transparent'
              color='closeMenu'
              _hover={{
                bg:'closeMenuHover'
              }}
              onClick={() => {dispatchSideBarStateAction({
                type: 'TOGGLE_OPENED_COLLAPSED'
              })}}>
              <DoubleArrowLeftIcon 
                borderRadius='8px'
                
                _active={{
                  transform: 'scale(.8)',
                  color: 'lightpink',
                  bg:'red'
                }}
                boxSize={ICON_SIZE}/>
            </IconButton>
        </Flex>
    
        <Box 
          paddingY='1em'
          flexBasis='0'
          flexGrow='1'
          w='100%'>
          <Scrollbars xOffset='1em'>
            <Flex as='section' 
              flexDirection='column' 
              gap='1em'
              alignItems='flex-start'>
              <Box as='nav'>
                <UnorderedList 
                  display='flex'
                  flexDir='column'
                  gap='1em'
                  listStyleType='none' 
                  margin='0'>
                  {
                    ROUTES.map(routeDetails => (
                      <ListItem
                        key={routeDetails.id}>
                        <ChakraLink 
                          _activeLink={{
                            bgColor: 'secondaryFg',
                            color: 'primaryText'
                          }}
                          as={NavLink} 
                          to={routeDetails.path} 
                          display='block'
                          borderRadius='8px'
                          _hover={{
                          bgColor: 'secondaryFg'
                          }}
                          _active={{
                            bgColor: 'secondaryFg'
                          }}>
                          {
                            React.createElement(routeDetails.icon, { boxSize: ICON_SIZE, })
                          }
                        </ChakraLink>
                      </ListItem>
                    ))
                  }
                </UnorderedList>
              </Box>
    
              <SeparatorIcon boxSize={ICON_SIZE} flexShrink='0'/>
                
              <Box>
                <UnorderedList 
                  display='flex'
                  flexDir='column'
                  gap='1em'
                  listStyleType='none' 
                  margin='0'>
                {
                  SERVICES.map(serviceDetails => (
                    <ListItem
                      key={serviceDetails.id}>
                      <IconButton 
                        aria-label={serviceDetails.title} 
                        display='block'
                        w='fit-content'
                        h='fit-content'
                        borderRadius='8px'
                        _hover={{
                          bgColor: 'secondaryFg'
                          }}
                        _active={{
                          bgColor: 'secondaryFg'
                        }}
                        bgColor='transparent'
                        icon= {
                          React.createElement(serviceDetails.icon, {
                            boxSize: ICON_SIZE,
                            onClick: serviceDetails.onClick,
                            })
                        } />
                    </ListItem>
                    ))
                }
                </UnorderedList>
              </Box>
            </Flex>
          </Scrollbars>
        </Box>
    
        <SeparatorIcon boxSize={ICON_SIZE} flexShrink='0'/>
    
        <Flex as='section'>
          <ToolsIcon boxSize={ICON_SIZE}/>
        </Flex>
        
        <Modal isOpen={isDBSettingsOpen} onClose={onDBSettingsClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Sistema Gerenciador de Banco de Dados</ModalHeader>

            <ModalCloseButton />

            <ModalBody>
              <Flex
                gap='1em'
                alignItems='flex-start'
                flexDir='column'>
                <Flex
                  w='100%'
                  alignItems='center'
                  gap='1em'>
                  <Text
                    flex='1'>
                    SQLite v3.39.3
                  </Text>

                  <Text
                    flex='1'>
                    {dbServices.isDBMSRunning? 'Executando' : 'Parado'}
                  </Text>

                  <Button
                    flex='1'
                    bgColor={
                      dbServices.isDBMSRunning? 'exclusion' : 'creation'
                    }
                    onClick={()=> {
                      dbServices.isDBMSRunning? dbServices.stopDBMS() : dbServices.startDBMS()
                    }}>
                    {
                      dbServices.isDBMSRunning? 
                      'Parar' : 
                      'Executar'
                    }
                  </Button>
                </Flex>

                <Button
                  onClick={handleDatabaseSave}>
                  Salvar
                </Button>

                <Flex>
                  <FormLabel
                  display='flex'
                  gap='.5em'
                  alignItems='center'
                  justifyContent='flex-start'
                  htmlFor='fileLoad'>
                  <FileDatabaseIcon/>
                  <Text>{fileName || 'Selecionar Arquivo *.bin'}</Text>
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

                    <Button 
                      onClick={handleDatabaseLoad}>
                      Carregar
                    </Button>
                </Flex>
              </Flex>

            </ModalBody>

            <ModalFooter>
              <Button 
                mr={3} 
                bgColor='closeMenu'
                _hover={{
                  bgColor: 'closeMenuHover'
                }}
                onClick={onDBSettingsClose}>
                Fechar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isRoomSettingsOpen} onClose={onRoomSettingsClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Sessão</ModalHeader>

            <ModalCloseButton />

            <ModalBody>
              <Flex
                gap='1em'
                flexDir='column'>

                <Flex
                  gap='1em'
                  flexDir='column'>
                    <Flex
                      alignItems='center'
                      justifyContent='space-between'>
                      <Text>
                        {storeServices.isConnected? 'Conectado' : 'Desconectado'}
                      </Text>
                      <Button
                        bgColor={
                          storeServices.isConnected? 'exclusion' : 'creation'
                        }
                        onClick={()=>{
                          if(storeServices.isConnected)
                          {
                            storeServices.disconnect();
                          }
                          else
                          {
                            storeServices.connect();
                          }
                        }}>
                        {storeServices.isConnected? 'Desconectar' : 'Conectar'}
                      </Button>
                    </Flex>
                    
                    <Flex 
                      justifyContent='space-between'>
                      <Text>Id da sala</Text>

                      <Text>
                        {storeServices.getSessionToken() || 'Nenhuma sessão ativa'}
                      </Text>
                    </Flex>
                  </Flex>
                  
                  <Flex
                    alignItems='flex-end'
                    gap='1em'
                    flexDir='column'>
                    <Flex
                      width='100%'
                      gap='1em'
                      alignItems='flex-start'
                      flexDir='column'>
                      <Input 
                        ref={sessionTokenRef}
                        type="text"/>

                      <Button
                        onClick={handleConnectToRoom}>Entrar na sala</Button>
                    </Flex>

                    <Button onClick={()=>{
                      storeServices.createSession()
                    }}>
                      Gerar nova sala
                    </Button>
                  </Flex>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button 
                mr={3} 
                bgColor='closeMenu'
                _hover={{
                  bgColor: 'closeMenuHover'
                }}
                onClick={onRoomSettingsClose}>
                Fechar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    )
  )
}

export default Sidebar