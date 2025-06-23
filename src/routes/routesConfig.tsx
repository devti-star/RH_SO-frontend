import { createBrowserRouter } from "react-router-dom";
import App from '../App.tsx'
import NotFoundPage from "../pages/notFoundPage.tsx";
import AdminDashboard from "../pages/AdminDashboard.tsx";



const router = createBrowserRouter([
    {path: "/", element: <App/>},
    {path: "/admin", element: <AdminDashboard />},
    {path: "*", element: <NotFoundPage/>},
]);


export default router;