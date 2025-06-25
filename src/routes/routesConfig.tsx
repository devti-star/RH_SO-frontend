import { createBrowserRouter } from "react-router-dom";
import App from '../App.tsx'
import NotFoundPage from "../pages/notFoundPage.tsx";
import SolicitacaoCarimbo from "../pages/solicitacaoCarimbo.tsx";
import SolicitacaoCracha from "../pages/SolicitacaoCracha.tsx";
import Login from "../auth/login.tsx";
import Teste from "../pages/teste.tsx";

/* alteraçoes que for feitas aqui devem alterar o shared/header*/

const router = createBrowserRouter([
<<<<<<< feature/nav_footer
    {path: "/login", element: <Login/>},
    {path: "/teste", element: <Teste/>},
=======
    {path: "/login", element: <Login/>},    
    {path: "/solicitacaoCarimbo", element: <SolicitacaoCarimbo />},
    {path: "/SolicitacaoCracha", element: <SolicitacaoCracha/>},
>>>>>>> main
    {path: "*", element: <NotFoundPage/>},
]);


export default router;
