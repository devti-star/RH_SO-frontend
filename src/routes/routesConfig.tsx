import { createBrowserRouter } from "react-router-dom";
import App from '../App.tsx'
import NotFoundPage from "../pages/notFoundPage.tsx";
import SolicitacaoCarimbo from "../pages/solicitacaoCarimbo.tsx";

const router = createBrowserRouter([
    {path: "/", element: <App/>},
    {path: "*", element: <NotFoundPage/>},
    { path: "/solicitacaoCarimbo", element: <SolicitacaoCarimbo /> }

]);


export default router;