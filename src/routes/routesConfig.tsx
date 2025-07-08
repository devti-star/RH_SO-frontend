import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../pages/notFoundPage.tsx";
import SesmtDashboard from "../pages/SesmtDashboard/SesmtDashboard.tsx";
import SolicitacaoCarimbo from "../pages/solicitacaoCarimbo.tsx";
import SolicitacaoCracha from "../pages/SolicitacaoCracha.tsx";
import Login from "../auth/login.tsx";
import TelaCadastro from "../pages/TelaCadastro/TelaCadastro.tsx";
import MinhasSolicitacoes from "../pages/MinhasSolicitacoes.tsx";
import MeusDados from "../pages/meus-dados.tsx";
import EnviarAtestadoSESMT from "../pages/enviar-atestado.tsx";
import Page from "../pages/Page";
import { GuardiaoAutenticacao } from "../guards/autenticacao.guard.ts";
import { GuardiaoAutorizacao } from "../guards/autorizacao.guard.ts";
import { Roles } from "../models/roles.ts";
import AcessoNaoAutorizado from "../pages/AcessoNaoAutorizado.tsx";
import ActivatePage from "../pages/ActivatePage.tsx";

/* alteraçoes que for feitas aqui devem alterar o shared/header*/

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <Page />,
    loader: GuardiaoAutenticacao,
    children: [
      {
        path: "meus-dados",
        element: <MeusDados />,
      },
      {
        path: "solicitacaoCarimbo",
        element: <SolicitacaoCarimbo />,
      },
      {
        path: "solicitacaoCracha",
        element: <SolicitacaoCracha />,
      },
      {
        path: "admin",
        element: <SesmtDashboard />,
        loader: GuardiaoAutorizacao([
          Roles.MEDICO,
          Roles.ENFERMEIRO,
          Roles.TRIAGEM,
          Roles.ADMIN,
        ]),
      },
      {
        path: "MinhasSolicitacoes",
        element: <MinhasSolicitacoes />,
      },
      {
        path: "enviar-atestado",
        element: <EnviarAtestadoSESMT />,
      },
    ],
  },
  {
    path: "/Cadastro",
    element: <TelaCadastro />,
  },
  {
    path: "/activate/:token",
    element: <ActivatePage />,
  },
  { path: "/AcessoNaoAutorizado", element: <AcessoNaoAutorizado /> },
  { path: "*", element: <NotFoundPage /> },
]);

export default router;
