import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";

//Основная форма аутентификации - Функциональный react component
const LoginForm: FC = (): JSX.Element => {
    //Создаем 2 локальных состояния для данных
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {store} = useContext(Context);

    //Форма отрисовки
    return (
        <div>
            <input
                type="text"
                placeholder="Email"
                value = {email}
                onChange = {(event) => {setEmail(event.target.value)} }
            />
            <input
                type="password"
                placeholder="Password"
                value = {password}
                onChange = {(event) => {setPassword(event.target.value)} }
            />

            <button onClick={()=> {store.login(email, password)}}>
                Login
            </button>

            <button onClick={()=> {store.registration(email,password)}}>
                Registration
            </button>
        </div>
    );
};

export default observer(LoginForm);