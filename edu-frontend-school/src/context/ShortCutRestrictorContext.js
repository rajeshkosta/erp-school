import React, { createContext, useContext, useState } from 'react';
import { HotkeysProvider, useHotkeys } from 'react-hotkeys-hook'
import App from '../App';

const ShortCutRestrictorContext = createContext();
const [disable, setdisable] = useState(false)

useHotkeys('ctrl+k','F10', () => setdisable(true), { scopes: ['settings'] })

export const useShortcutContext = () => useContext(ShortCutRestrictorContext);

export const ShortcutProvider = ({ children }) => {
  const [blockedShortcuts, setBlockedShortcuts] = useState([]);

  const blockShortcut = (shortcut) => {
    setBlockedShortcuts((prevShortcuts) => [...prevShortcuts, shortcut]);
  };

  return (
    <HotkeysProvider>
        <App></App>
    </HotkeysProvider>
    // <ShortCutRestrictorContext.Provider value={{ blockedShortcuts, blockShortcut }}>
    //   {children}
    // </ShortCutRestrictorContext.Provider>
  );
};