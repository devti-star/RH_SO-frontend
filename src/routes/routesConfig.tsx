import { createBrowserRouter } from "react-router-dom";
import App from '../App.tsx'
import NotFoundPage from "../pages/notFoundPage.tsx";
import Login from "../auth/login.tsx";
import Teste from "../pages/teste.tsx";

/* alteraçoes que for feitas aqui devem alterar o shared/header*/

const router = createBrowserRouter([
    {path: "/login", element: <Login/>},
    {path: "/teste", element: <Teste/>},
    {path: "*", element: <NotFoundPage/>},
]);


export default router;
