import type { Client } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

interface IUserContext {
    client: Client | null;
    clientSetter: Dispatch<SetStateAction<Client | null>> | null
}

const UserContext = createContext<IUserContext>({
    client: null,
    clientSetter: null,
});

export default UserContext;