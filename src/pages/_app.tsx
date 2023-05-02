import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import UserContext from "~/Context/UserContext";
import { useEffect, useState } from "react";
import { Client } from "@prisma/client";
import { clientSchema } from "~/schemas/client";
import Layout from "~/components/layout";

const MyApp: AppType = ({ Component, pageProps }) => {
  const initialState: Client | null = null;
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    let client: Client | null = null;
    if (localStorage.getItem('client')) {
      const parseResult = clientSchema.safeParse(JSON.parse(localStorage.getItem('client')!));
      if (parseResult.success) client = parseResult.data;
      else throw new Error("_app.tsx Client in localStorage is invalid");
    }

    if (client) {
      setClient(client);
    }
  }, []);

  useEffect(() => {
    if (client !== initialState) {
      localStorage.setItem("client", JSON.stringify(client));
    }
  }, [client]);

  return (
    <UserContext.Provider value={{ client: client, clientSetter: setClient}}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContext.Provider>
  )


};

export default api.withTRPC(MyApp);
