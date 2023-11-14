import React from 'react';

import { Tabs as ChakraTabs, Flex, TabList, TabPanel, TabPanels, Text } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/global/AppContext';
import { DevicesTypes } from '../../hooks/useDeviceInfo';
import LogicalGeralTab from './LogicalGeralTab';
import LogicalPropertiesTab from './LogicalPropertiesTab';
import LogicalSceneTab from './LogicalSceneTab';
import { Tab, handleScroll } from './Tabs';

const tabs = {
  generics: [
    {
      id: 0,
      name: 'Cena',
      component: LogicalSceneTab,
    }
  ],
  objects: [
    {
      id: 1,
      name: 'Geral',
      component: LogicalGeralTab,
    },
    {
      id: 2,
      name: 'Propriedades',
      component: LogicalPropertiesTab,
    }
  ]
}

/**
 * Componente que representa as Tabs da Ferramenta de Modelagem Lógica.
 */
function LogicalTabs() {
  const { deviceInfo } = useAppContext();

  return (
    deviceInfo.isDeviceThisType(DevicesTypes.mobile, DevicesTypes.tablet) ? (
      <ChakraTabs
        color='primaryText'
        bg='primaryFg'
        colorScheme='primaryFg'
        flexBasis='20%'
        overflow='hidden'
        orientation='vertical'>

        <TabPanels
          overflowY='scroll'>
          {
            tabs.generics.map(generic => (
              <TabPanel key={generic.id}>
                {React.createElement(generic.component)}
              </TabPanel>
            ))
          }
          {
            tabs.objects.map(object => (
              <TabPanel key={object.id}>
                {React.createElement(object.component)}
              </TabPanel>
            ))
          }
        </TabPanels>

        <TabList
          alignItems='center'
          overflowY='scroll'
          overflowX='hidden'
          onWheel={handleScroll}>
          {
            tabs.generics.map(generic => (
              <Tab key={generic.id} variant='vertical'>
                <Text>{generic.name}</Text>
              </Tab>
            ))
          }

          {
            tabs.objects.map(object => (
              <Tab key={object.id} variant='vertical'>
                <Text>{object.name}</Text>
              </Tab>
            ))
          }
        </TabList>

      </ChakraTabs>
    ) : (
      <Flex
        as='section'
        flex='1.5'
        overflow='hidden'
        flexDir='column'>
        <ChakraTabs
          flex='1'
          color='primaryText'
          bg='primaryFg'
          colorScheme='primaryFg'
          flexBasis='20%'
          overflow='hidden'
          orientation='vertical'>

          <TabPanels
            overflow='scroll'>
            {
              tabs.generics.map(generic => (
                <TabPanel key={generic.id}>
                  {React.createElement(generic.component)}
                </TabPanel>
              ))
            }
          </TabPanels>

          <TabList
            borderLeft='1px solid'
            borderLeftColor='secondaryFg'
            alignItems='center'
            overflow='hidden'
            onWheel={handleScroll}>
            {
              tabs.generics.map(generic => (
                <Tab key={generic.id} variant='vertical'>
                  <Text>{generic.name}</Text>
                </Tab>
              ))
            }
          </TabList>
        </ChakraTabs>

        <ChakraTabs
          borderTop='1px solid'
          borderTopColor='secondaryFg'
          flex='1'
          color='primaryText'
          bg='primaryFg'
          colorScheme='primaryFg'
          flexBasis='20%'
          overflow='hidden'
          orientation='vertical'>

          <TabPanels
            overflow='scroll'>
            {
              tabs.objects.map(object => (
                <TabPanel key={object.id}>
                  {React.createElement(object.component)}
                </TabPanel>
              ))
            }
          </TabPanels>

          <TabList
            borderLeft='1px solid'
            borderLeftColor='secondaryFg'
            alignItems='center'
            overflow='hidden'
            onWheel={handleScroll}>
            {
              tabs.objects.map(object => (
                <Tab key={object.id} variant='vertical'>
                  <Text>{object.name}</Text>
                </Tab>
              ))
            }
          </TabList>
        </ChakraTabs>
      </Flex>
    )
  )
}

export default LogicalTabs