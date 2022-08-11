import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Store from "./store/store";

interface State {
    store: Store,
}

const store: Store = new Store();

//Создадим контекст для получения данных
export const Context: React.Context<State> = createContext<State>({
    store,
});

const container: Element | DocumentFragment = document.getElementById('root')!;
const root: ReactDOM.Root = ReactDOM.createRoot(container);

root.render(
    <React.StrictMode>
    <Context.Provider value={{
        store
    }}>
        <App />
    </Context.Provider>
    </React.StrictMode>
);


