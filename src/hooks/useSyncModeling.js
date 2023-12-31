import { getYjsDoc, syncedStore } from "@syncedstore/core";
import { useSyncedStore } from "@syncedstore/react";
import { useEffect, useState } from "react";
import { WebsocketProvider } from 'y-websocket';
import ConceptualStore from "../components/modeling/types/ConceptualStore";
import LogicalStore from "../components/modeling/types/LogicalStore";

const SOCKET_SERVER = import.meta.env.VITE_NODE_ENV === 'PRODUCTION'? import.meta.env.VITE_SOCKET_SERVER_URL_PROD : import.meta.env.VITE_SOCKET_SERVER_URL_DEV || import.meta.env.VITE_SOCKET_SERVER_URL;
const DEFAULT_ROOM = '';

const store = syncedStore({
  conceptual: {},
  logical: {}
})

ConceptualStore(store.conceptual);
LogicalStore(store.logical);

/**
 * Criar um novo provedor de conexão.
 * 
 * @param {String} room 
 * @returns {WebsocketProvider}
 */
function createProvider(room = DEFAULT_ROOM)
{
  const doc = getYjsDoc(store);

  const websocketProvider = new WebsocketProvider(
    SOCKET_SERVER,
    room,
    doc,
    {
      connect: room !== DEFAULT_ROOM,
      maxBackoffTime: 10_000,
      disableBC: true,
    }
  );

  return websocketProvider;
}

/**
 * Hook para abstrair o documento compartilhado, o gerenciamento de seu ciclo de vida e suas operações.
 * 
 * Note que o documento, contudo, é um singleton e múltiplos Hooks manipulam o mesmo documento.
 */
export function useSyncModeling()
{
  const [websocketProvider, setProvider] = useState(createProvider);
  const [room, setRoom] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(()=>{
    function status(event)
    {
      console.log('status', event.status);

      const status = event.status;

      if(status === 'connected'
        && connected !== 'connected')
      {
        setConnected(true);
      }
      else if(status === 'disconnected'
        && connected !== 'disconnected')
      {
        setConnected(false);
      }
    }

    websocketProvider.on('status', status);

    return ()=>{
      websocketProvider.destroy();
    }
  }, [websocketProvider]);

  const smartStore = useSyncedStore(store);

  /**
   * Criar uma nova sessão/sala.
   * 
   * Se uma sessão já existe, ela é desconectada.
   */
  function createSession()
  {
    if(connected)
    {
      disconnect();
    }

    const token = crypto.randomUUID();
    const newStore = createProvider(token);

    setRoom(token);
    setProvider(newStore);
  }

  /**
   * Obter o token da sessão/sala atual
   * @returns {String | null}
   */
  function getSessionToken()
  {
    return room;
  }

  /**
   * Conectar a uma sessão/sala arbitrária.
   * 
   * Se uma sessão já existe, ela é desconectada.
   * 
   * @param {String} token 
   */
  function connectToSession(token)
  {
    if(connected)
    {
      disconnect()
    }

    setRoom(token);
    setProvider(createProvider(token));
  }

  /**
   * Desconectar da sessão/sala atual.
   */
  function disconnect()
  {
    websocketProvider.disconnect();
  }

  /**
   * Conectar na sessão/sala atual.
   * 
   * Caso não exista alguma, uma nova sessão/sala é criada.
   * 
   * @returns 
   */
  function connect()
  {
    if (getSessionToken())
    {
      websocketProvider.connect();
      return;
    }

    createSession();
  }

  return {
    store: smartStore,
    createSession,
    getSessionToken,
    connectToSession,
    isConnected: connected,
    disconnect,
    connect,
  };
}

