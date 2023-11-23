import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [status, setStatus] = useState(false)
  const [id, setID] = useState('')
  const [reload, setReload] = useState(false)
  const [socket, setSocket] = useState(null);
  const [address, setAddress] = useState('')
  const [lightDot, setLightDot] = useState(false);
  const [isUpdate, setUpdate] = useState(false)
  const [screen, setScreen] = useState(0)
  const [SelectedID, setSelectedID] = useState(null)
  const [isTake, setTake] = useState(false)
  const [display, setDisplay] = useState(false)

  const toggleLightDot = () => {
    setLightDot(!lightDot);
  };

  useEffect(() => {
    if (lightDot) {
      const newSocket = io('http://192.168.61.86:3000', {
        query: { id, type: 1, joinRoom: 'driver' }
      });
      setSocket(newSocket);
    } else {
      if (socket) {
        socket.disconnect();
      }
    }
    // return {
    //   if(socket) {
    //     socket.disconnect();
    //   }
    // }
  }, [lightDot]);

  return (
    <AppContext.Provider value={{
      lightDot, toggleLightDot,
      status, setStatus,
      id, setID,
      socket,
      address, setAddress,
      reload, setReload,
      isUpdate, setUpdate,
      screen, setScreen,
      SelectedID, setSelectedID,
      isTake, setTake,
      display, setDisplay
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext  // = () => useContext(AppContext)
