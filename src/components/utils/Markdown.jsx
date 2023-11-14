import React from 'react';

import { Heading, Link, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

/**
 * Componente que representa um Documento Markdown.
 */
function Markdown({variant, children}) {
  return (
    <ReactMarkdown
      components={{
        a({children, node, ...props})
        {
          return (
            <Link href={props.href} target='_blank'>
              {children}
            </Link>
          )
        },
        h1({children, node, ...props})
        {
          return (
            <Heading 
              marginY='1em'
              as='h1'>
              {children}
            </Heading>
          )
        },
        h2({children, node, ...props})
        {
          return (
            <Heading 
            marginY='1em'
              as='h2'>
              {children}
            </Heading>
          )
        },
        h3({children, node, ...props})
        {
          return (
            <Heading 
              marginY='1em'
              as='h3'>
              {children}
            </Heading>
          )
        },
        p({children, node, ...props})
        {
          if(variant === 'mobile')
          {
            return (
              <Text 
              marginY='1em' 
              lineHeight='2'
              fontSize='1.6rem' 
              textAlign='justify'>
              {children}
            </Text>
            )
          }

          return (
            <Text 
              marginY='1em' 
              lineHeight='2'
              fontSize='2.4rem' 
              textAlign='justify'>
              {children}
            </Text>
          )
        },
        ul({children, node, ...props})
        {
          return (
            <UnorderedList marginLeft='2em'>
              {
                children
                  .filter(element => element.type === 'li')
                  .map(element => (
                    <ListItem key={element.key}>
                      {element.props.children}
                    </ListItem>
                  ))
              }
            </UnorderedList>
          )
        },
      }} >
      {children}
    </ReactMarkdown>
  )
}

export default Markdown