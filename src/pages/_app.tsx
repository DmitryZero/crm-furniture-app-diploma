import type { AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import UserContext from "~/Context/UserContext";
import { useState } from "react";
import { Client } from "@prisma/client";
import Layout from "~/components/layout";
import Spinner from "~/components/Spinner"

const MyApp: AppType = ({ Component, pageProps }) => {
  const [clientState, setClient] = useState<Client | null>(null);
  const [enabledRequest, setEnableRequest] = useState(true);

  const { isLoading } = api.client.getClientByCookie.useQuery(undefined, {
    enabled: enabledRequest,
    onSuccess: (data) => {
      setClient(data);
      setEnableRequest(false);
    },
    onError: () => {
      setEnableRequest(false)
    }
  });

  if (isLoading) return (<Spinner />);
  return (
    <UserContext.Provider value={{ client: clientState, clientSetter: setClient }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContext.Provider>
  )
};

export default api.withTRPC(MyApp);
