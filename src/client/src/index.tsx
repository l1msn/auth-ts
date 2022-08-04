import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Store from "./store/store";

interface State {
    store: Store,
}

const store: Store = new Store();

//Создадим контекст для получения данных
export const Context: React.Context<State> = createContext<State>({
    store,
})

ReactDOM.render(
    <Context.Provider value={{
        store
    }}>
        <App />
    </Context.Provider>,

  document.getElementById('root')
);


