import { createBrowserRouter } from "react-router-dom";
import App from '../App.tsx'
import NotFoundPage from "../pages/notFoundPage.tsx";
import Login from "../auth/login.tsx";
import TelaCadastro from "../pages/TelaCadastro/TelaCadastro.tsx";


const router = createBrowserRouter([
    {path: "/login", element: <Login/>},
    {path: "/telaCadastro", element: <TelaCadastro />},
    {path: "*", element: <NotFoundPage/>},
]);


export default router;