import { createBrowserRouter } from "react-router-dom";
import App from "../App.tsx";
import NotFoundPage from "../pages/notFoundPage.tsx";
import SolicitacaoCarimbo from "../pages/solicitacaoCarimbo.tsx";
import SolicitacaoCracha from "../pages/SolicitacaoCracha.tsx";
import Login from "../auth/login.tsx";
import Page from "../pages/Page.tsx";

/* alteraçoes que for feitas aqui devem alterar o shared/header*/

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <Page />,
    children: [
      { path: "/solicitacaoCarimbo", element: <SolicitacaoCarimbo /> },
      { path: "/SolicitacaoCracha", element: <SolicitacaoCracha /> },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);

export default router;
