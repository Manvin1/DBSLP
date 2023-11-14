import React, { useState } from 'react'

import { Box, Button as ChakraButton, Flex, FormControl, Input, Text } from '@chakra-ui/react';
import { pdfjs, Document, Page } from 'react-pdf';
import FileSaver from 'file-saver';

import 'react-pdf/dist/Page/TextLayer.css';
import './PDF.css';
import Loading from './Loading';


const INITIAL_PAGE = 1;

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

/**
 * Componente que representa um Botão.
 */
function Button({children, ...props})
{
  return (
    <ChakraButton
      bg='transparent'
      fontSize='1.6rem'
      fontWeight='normal'
      _hover={{
        bgColor: 'primaryFg',
      }}
      color='inherit'
      {...props} >
      {children}
    </ChakraButton>
  )
}

/**
 * Componente que representa um arquivo PDF.
 */
function PDF({name, path}) {

  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [scale, setScale] = useState(1.0);

  function handleDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setCurrentPage(INITIAL_PAGE);
  }

  function moveToPageByOffset(offset) {
    setCurrentPage(currentPage => {
      const target = currentPage + offset;
      return target <= 1? INITIAL_PAGE : target > numPages? numPages : target;
    });
  }

  function handleSeekPage(target) {
    setCurrentPage(target <= 1? INITIAL_PAGE : target > numPages? numPages : target);
  }

  function handleMoveToPreviousPage() {
    moveToPageByOffset(-1);
  }

  function handleMoveToNextPage() {
    moveToPageByOffset(1);
  }
  
  function handleScaleOffset(offset)
  {
    setScale(scale => {
      const target = scale + offset;
      return target <= 0.1? 0.1 : target > 2? 2 : target;
    });
  }
  
  function handlePdfDownload()
  {
    FileSaver.saveAs(path, name);
  }

  return (
    <Flex 
      as='section'
      direction='column'
      w='100%'
      h='100%'
      bgColor='secondaryFg' >
      <Flex 
        as='header'
        justifyContent='space-between'
        bg='primary'
        padding='1em'
        fontFamily='primary'
        color='primaryText'>
        <Flex
          gap='1em'>
          <Button
            disabled={!numPages || currentPage <= 1}
            onClick={handleMoveToPreviousPage}
            >
            Anterior
          </Button>

          <Flex 
            gap='.5em'
            alignItems='center'>
            <FormControl
              w='10rem'
              onSubmit={(e) => {handleSeekPage}}>
              <Input
                type='number'
                value={currentPage || '-'}
                bg='primaryText'
                color='black'
                textAlign='right'
                w='100%'
                borderRadius='none'
                border='1px solid black'
                placeholder='Página...'
                onChange={e => {
                  handleSeekPage(Number(e.target.value) || currentPage)
                }}
              />
            </FormControl>

            <Text>de {numPages || '-'}</Text>
          </Flex>

          <Button
            disabled={!numPages || currentPage >= numPages}
            onClick={handleMoveToNextPage}
            >
            Próxima
          </Button>
        </Flex>

        <Flex 
          gap='.5em'
          alignItems='center'>
          <Button
            fontSize='2rem'
            onClick={() => {handleScaleOffset(-0.1)}}>
            -
          </Button>
          <Text>{scale.toFixed(2)}</Text>
          <Button
            fontSize='2rem'
            onClick={() => {handleScaleOffset(+0.1)}}>
            +
          </Button>
        </Flex>

        <Button
          onClick={handlePdfDownload}>
          Baixar
        </Button>
      </Flex>

      <Box
        flexBasis='0'
        flexGrow='1'
        backgroundColor='transparent'
        overflow='scroll'>
        <Document
          file={path}
          loading={<Loading msg='Carregando visualizador...'/>}
          onLoadSuccess={handleDocumentLoadSuccess}
          className='pdfContainer' >
          <Page
            renderAnnotationLayer={false}
            pageNumber={currentPage}
            loading={<Loading msg='Carregando página...'/>}
            className='pdfContainer__pdf'
            canvasBackground='white'
            scale={scale}>
          </Page>
        </Document>
      </Box>
    </Flex>
  )
}

export default PDF