import { motion } from "framer-motion";
import styles from "./Login.module.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../firebase/config";
import { AuthValue } from "../../context/AuthContext";
import { useState } from "react";
import estiloCadastro from "../Cadastro/Cadastro.module.css";
import icon from "../../images/login.svg";
import spinner from "../../images/spin.svg";
import estilo from "../NovoProjeto/NovoProjeto.module.css";

function Login() {
    const auth = getAuth(app);
    //  Pegando o valor global do Contexto
    const { user, setUser1 } = AuthValue();

    //  Hooks do form
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [loading, setLoading] = useState(false);

    //  Mensagem de erro
    const [erroMsg, setErroMsg] = useState("");

    //  Fazendo o login
    async function validar(e) {
        e.preventDefault();
        setLoading(true);
        await signInWithEmailAndPassword(auth, email, senha)
            .then((userCredential) => {
                setLoading(false);
                console.log("logado com sucesso, o usuário é: ", userCredential);
                setUser1(userCredential);
            })
            .catch((err) => {
                setLoading(false);
                console.log(`ops, aconteceu o erro: ${err}`);
                let errorCode = err.code;
                let errorMessage = err.message;
                //  Tratando os erros do firebase
                if (errorMessage.includes("invalid-email")) {
                    setErroMsg("O email inserido é inválido!");
                } else if (errorMessage.includes("wrong-password")) {
                    setErroMsg("A senha está incorrecta");
                } else if (errorMessage.includes("user-not-found")) {
                    setErroMsg("Este email não possui uma conta neste site!");
                } else {
                    setErroMsg("O servidor está indisponível, tente mais tarde!");
                }
                setTimeout(() => {
                    setErroMsg("");
                }, 4000);
            });
    }

    return (
        <>
            {loading === false ? (
                <motion.section
                    initial={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    id={estiloCadastro.container}
                >
                    <h2>Entrar</h2>

                    <p>Faça o login para poder utilizar o sistema</p>
                    <div>
                        <form onSubmit={validar}>
                            <fieldset>
                                <label htmlFor="">Email:</label>
                                <input
                                    value={email}
                                    required
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    type="email"
                                    placeholder="Email do usuário"
                                />
                            </fieldset>
                            <fieldset>
                                <label htmlFor="">Senha:</label>
                                <input
                                    value={senha}
                                    required
                                    onChange={(e) => {
                                        setSenha(e.target.value);
                                    }}
                                    type="password"
                                    placeholder="Insira sua senha"
                                />
                            </fieldset>
                            <button>Entrar</button>

                            {/*Caso hava erro ao se fazer login */}
                            {erroMsg.length > 0 ? (
                                <p style={{ color: "red", position: "absolute", marginTop: "4px", fontWeight: "600" }}>{erroMsg}</p>
                            ) : undefined}
                        </form>
                        <img src={icon} id={styles.img} alt="icone" />
                    </div>
                </motion.section>
            ) : (
                <img id={estilo.loading} src={spinner} alt="carregando..." />
            )}
        </>
    );
}

export default Login;
