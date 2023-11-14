import React, { useEffect } from 'react'
import { useAppContext } from '../contexts/global/AppContext'
import LoadingAware from './utils/LoadingAware';
import LoadingState from './utils/LoadingState';
import ReadyState from './utils/ReadyState';
import Loading from './utils/Loading';
import { DevicesTypes } from '../hooks/useDeviceInfo';
import ErrorState from './utils/ErrorState';
import UnsupportedDevice from '../pages/UnsupportedDevice';
import { Box } from '@chakra-ui/react';

/**
 * Componente que representa um gerenciador de alto nível do contexto da aplicação.
 */
function ContextManager({children}) {
  const {
    loadingState, dispatchLoadingStateAction,
    deviceInfo: {deviceType},
  } = useAppContext();

  useEffect(() => {
    switch(deviceType)
    {
      case DevicesTypes.undetermined: {
        dispatchLoadingStateAction({
          type: 'SET_LOADING',
        });
        break;
      }
      case DevicesTypes.unsupported: {
        
        dispatchLoadingStateAction({
          type: 'SET_ERROR',
        });
        break;
      }
      default: {
        dispatchLoadingStateAction({
          type: 'SET_READY',
        });
        break;
      }
    }
  }, [deviceType]);

  return (
    <LoadingAware state={loadingState}>
      <LoadingState>
        <Box as='main'
          w='100%'
          h='100vh' >
          <Loading/>
        </Box>
      </LoadingState>

      <ReadyState>
        {children}
      </ReadyState>

      <ErrorState>
        <UnsupportedDevice/>
      </ErrorState>
    </LoadingAware>
  );
}

export default ContextManager