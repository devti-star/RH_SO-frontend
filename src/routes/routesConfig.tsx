import { createBrowserRouter } from "react-router-dom";
import App from '../App.tsx'
import NotFoundPage from "../pages/notFoundPage.tsx";
import SolicitacaoCarimbo from "../pages/solicitacaoCarimbo.tsx";
import SolicitacaoCracha from "../pages/SolicitacaoCracha.tsx";
import Login from "../auth/login.tsx";
import MeusDados from "../pages/meus-dados.tsx";


/* alteraçoes que for feitas aqui devem alterar o shared/header*/

const router = createBrowserRouter([
    {path: "/login", element: <Login/>},    
    {path: "/solicitacaoCarimbo", element: <SolicitacaoCarimbo />},
    {path: "/SolicitacaoCracha", element: <SolicitacaoCracha/>},
    {path: "/meus-dados", element: <MeusDados/>},
    {path: "*", element: <NotFoundPage/>},
]);


export default router;
