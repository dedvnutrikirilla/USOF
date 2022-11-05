import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import MainMenu from "./components/main/mainMenu";
import { AuthContext } from "./contexts/authContext";
import { CookiesProvider } from 'react-cookie';

import './total.css';
import styles from "./components/auth/TotalAuth.module.css"

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useState } from "react";

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainMenu/>
  },
  {
    path: '/:chunk',
    element: <MainMenu/>
  },
  {
    path: '/ask',
    element: <MainMenu element="ask"/>
  },
  {
    path: '/post/:postId',
    element: <MainMenu element="viewPost"/>
  },
  {
    path: '/auth/login',
    element: <div className={styles.total}><Login/></div>
  },
  {
    path: '/auth/register',
    element: <div className={styles.total}><Register/></div>
  }
]);

function App() {
  const [Authobj, setAuthObj] = useState({});
  
  return (
    <CookiesProvider>
    <div className="App">
      <AuthContext.Provider value={{
        Authobj,
        setAuthObj
      }}>
        <RouterProvider router={router}/>
      </AuthContext.Provider>
    </div>
    </CookiesProvider>
  );
}

export default App;
