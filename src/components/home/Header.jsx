import React from 'react';

import { Box, Button, Link as ChakraLink, Flex, ListItem, Menu, MenuButton, MenuItem, MenuList, UnorderedList } from '@chakra-ui/react';
import { Link, NavLink, } from 'react-router-dom';

import { PAGES, useHomeContext } from '../../contexts/HomeContext';
import { ArrowDownIcon, LogoIcon } from '../utils/Icons';
import { useAppContext } from '../../contexts/global/AppContext';
import { DevicesTypes } from '../../hooks/useDeviceInfo';

/**
 * Componente que representa o cabeçalho 
 */
function Header() {
  const {currentPage} = useHomeContext();
  const {
    deviceInfo: { isDeviceThisType }
  } = useAppContext();

  return (
    <Box 
      as='header'
      bgColor='primary'
      color='primaryText'
      fontFamily='primary'
      py='.5em'
      height='7rem'
      borderBottom='1px solid black'>
      <Flex
        w='90%'
        margin='auto'
        justifyContent='space-between'
        alignItems='center'>
        <Flex 
          alignItems='center'
          fontSize='5xl'>
          <p>DBSLP</p>
          <LogoIcon 
            w='60px'
            h='60px'/>
        </Flex>
        
        <Box as='nav' fontSize='18px'>
          {
            isDeviceThisType(DevicesTypes.desktop)? (
              <UnorderedList
                display='flex'
                gap='1em'>
              {
                PAGES.map(pageDetails => (
                  <ListItem
                    listStyleType='none'>
                    <ChakraLink 
                        as={NavLink}
                        _activeLink={{
                          textDecor: 'underline'
                        }}
                        to={pageDetails.path} 
                        key={pageDetails.id}
                        _hover={{
                          color: 'white'
                          }}>
                        {pageDetails.title}
                    </ChakraLink>
                  </ListItem>
                ))
              }
              </UnorderedList>
            ) : (
              <Menu>
            <MenuButton
              as={Button}
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
              {currentPage}
            </MenuButton>
            
            <MenuList
              zIndex='3'
              color='secondaryText'>
              {
                PAGES.map(pageDetails => (
                  <ChakraLink 
                      as={Link} 
                      to={pageDetails.path} 
                      key={pageDetails.id}
                      _hover={{
                        color: 'white'
                        }}
                      >
                      <MenuItem 
                        _hover={{
                          bg: 'primaryFg',
                          textColor: 'primaryText'
                        }} >
                          {pageDetails.title}
                      </MenuItem>
                  </ChakraLink>
                ))
              }
            </MenuList>
          </Menu>
            )
          }
          
        </Box>
      </Flex>
    </Box>
  )
}

export default Header