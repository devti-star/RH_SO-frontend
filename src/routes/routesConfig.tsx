import { createBrowserRouter } from "react-router-dom";
import App from "../App.tsx";
import NotFoundPage from "../pages/notFoundPage.tsx";
import AdminDashboard from "../pages/AdminDashboard.tsx";
import SolicitacaoCarimbo from "../pages/solicitacaoCarimbo.tsx";
import SolicitacaoCracha from "../pages/SolicitacaoCracha.tsx";
import Login from "../auth/login.tsx";
import TelaCadastro from "../pages/TelaCadastro/TelaCadastro.tsx";
import MinhasSolicitacoes from "../pages/MinhasSolicitacoes.tsx";
import MeusDados from "../pages/meus-dados.tsx";
import EnviarAtestadoSESMT from "../pages/enviar-atestado.tsx";
import Page from "../pages/Page"; 


/* alteraçoes que for feitas aqui devem alterar o shared/header*/

const router = createBrowserRouter([

  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <Page />,
    children: [

      {path: "/meus-dados", element: <MeusDados/>},
      { path: "/solicitacaoCarimbo", element: <SolicitacaoCarimbo /> },
      { path: "/solicitacaoCracha", element: <SolicitacaoCracha /> },
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/MinhasSolicitacoes", element: <MinhasSolicitacoes /> },
      { path: "/enviar-atestado", element: <EnviarAtestadoSESMT /> },
    ],
  },
  { path: "/Cadastro", element: <TelaCadastro/>},
  { path: "*", element: <NotFoundPage /> },

]);

export default router;
