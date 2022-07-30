import React, {FC, useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import IUser from "./models/IUser";
import UserService from "./services/UserService";

const App: FC = () => {
    const {store} = useContext(Context);
    //Создаем локальное состояние для списка пользователей
    const [users, setUsers] = useState<IUser[]>([]);

    //Проверяем при 1ом запуске приложения наличие токена
    useEffect(()=> {
        if(localStorage.getItem('token'))
            store.checkAuth();
    },[]);

    /**
     * @description - Метод получения всех пользователей
     * @async
     * @method
     */
    async function getUsers() {
        try {
            console.log("Getting users...");
            const response = await UserService.fetchUsers();
            if(!response)
                throw new Error("Cannot fetch api - users");

            setUsers(response.data);

        } catch (error: any) {
            //Обрабатываем ошибки и отправляем статус код
            console.log("Error on getUsers in App")
            console.log(error.response?.data?.message);
        }
    }

    if(store.isLoading){
        return <div>Loading...</div>
    }

    if(!store.isAuth)
        return (
            <LoginForm/>
        );

  return (
    <div>
        <h1>{store.isAuth ? `User ${store.user.email} auth!` : `User not auth!`}</h1>
        <h2>{store.user.isActivated ? "User is activated" : "User not activated"}</h2>
        <button onClick={()=> {store.logout()}}>Logout</button>
        <div>
            <button onClick={getUsers}>Get a users</button>
        </div>
        {
            users.map((user)=> <div key={user.email}>{user.email}</div> )
        }
    </div>
  );
}

export default observer(App);
