import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../pages/notFoundPage.tsx";
import SolicitacaoCarimbo from "../pages/solicitacaoCarimbo.tsx";
import SolicitacaoCracha from "../pages/SolicitacaoCracha.tsx";
import Login from "../auth/login.tsx";
import TelaCadastro from "../pages/TelaCadastro/TelaCadastro.tsx";


const router = createBrowserRouter([

    {path: "/login", element: <Login/>},    
    {path: "/solicitacaoCarimbo", element: <SolicitacaoCarimbo />},
    {path: "/SolicitacaoCracha", element: <SolicitacaoCracha/>},
    {path: "/Cadastro", element: <TelaCadastro/>},
    {path: "*", element: <NotFoundPage/>},
]);


export default router;