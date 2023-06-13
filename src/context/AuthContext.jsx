import { useContext } from "react";
import { createContext } from "react";

//  Criando o contexto global
export const AuthContext = createContext();

//  Exportando o provedor de contexto
export function AuthProvider({ children, value }) {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthValue() {
    return useContext(AuthContext);
}
