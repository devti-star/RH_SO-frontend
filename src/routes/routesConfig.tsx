import { createBrowserRouter } from "react-router-dom";
import App from '../App.tsx'
import NotFoundPage from "../pages/notFoundPage.tsx";
import Login from "../auth/login.tsx";


const router = createBrowserRouter([
    {path: "/login", element: <Login/>},
    {path: "*", element: <NotFoundPage/>},
]);


export default router;