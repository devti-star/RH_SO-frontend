import { createBrowserRouter } from "react-router-dom";
import App from '../App.tsx'
import NotFoundPage from "../pages/notFoundPage.tsx";


const router = createBrowserRouter([
    {path: "/", element: <App/>},
    {path: "*", element: <NotFoundPage/>},
]);


export default router;