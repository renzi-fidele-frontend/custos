import styles from "./Projetos.module.css";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import notFound from "../../images/notFound.svg";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { AuthValue } from "../../context/AuthContext";
import spinner from "../../images/spin.svg";
import estilo from "../NovoProjeto/NovoProjeto.module.css";

function Projetos() {
    const location = useLocation();

    const navegar = useNavigate();

    const [loading, setLoading] = useState(false);

    const [meusProjetos, setMeusProjetos] = useState([]);

    //  Mensagem que de sucesso de remoção
    const [mensagem, setMensagem] = useState("");

    //  Pegando o usuário no contexto global
    const { user } = AuthValue();

    //  Mensagem de sucesso de criação de projeto
    const [msg_sucesso, setMsg_sucesso] = useState("");

    //  Apanhando os projetos do usuario
    async function apanhar() {
        setLoading(true);
        let arr = [];
        const q = query(collection(db, "projetos"), where("ownerId", "==", user.uid));

        const captura = await getDocs(q);
        captura.forEach((doc) => {
            arr.push({ id: doc.id, data: doc.data() });
        });
        console.log(arr);
        setMeusProjetos(arr);
        setLoading(false);
    }

    useEffect(() => {
        apanhar();
        //  Mandando a mensagem caso haja alguma vindo do servidor
        if (location.state) {
            setMsg_sucesso(location.state);
        }
        setTimeout(() => {
            setMsg_sucesso("");
        }, 4000);
    }, []);

    //  Removendo um projeto
    function removeProject(id) {
        fetch(`http://localhost:5000/projetos/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(() => {
                setMeusProjetos(meusProjetos.filter((projeto) => projeto.id !== id));
            })
            .catch((err) => console.log(`Ops, aconteceu o erro: ${err}`));
    }

    return (
        <>
            {loading === false ? (
                <motion.section
                    initial={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    id={styles.container}
                    style={{ minHeight: "70vh" }}
                >
                    {/*Caso haja mensagem de confirmação ao se criar um projeto*/}
                    {msg_sucesso.length > 0 && (
                        <motion.span
                            transition={{ duration: 1 }}
                            initial={{ opacity: 0, y: -100 }}
                            animate={{ opacity: 1, y: 0 }}
                            id={styles.sucesso}
                        >
                            {msg_sucesso}
                        </motion.span>
                    )}

                    {/*Caso haja uma mensagem de remoção de projeto */}
                    {mensagem.length > 0 && <span className={styles.removido}>{mensagem}</span>}

                    {/*Caso haja algum projeto*/}
                    {meusProjetos.length > 0 ? (
                        <div id={styles.flex}>
                            <div id={styles.col}>
                                <h2>Meus projetos</h2>
                                <div id={styles.projects_container}>
                                    {meusProjetos.map((v, index) => {
                                        return (
                                            <div key={index} className={styles.project_card}>
                                                <h2 id={styles.nome}>{v.data.titulo}</h2>
                                                <p id={styles.orcamento}>
                                                    <strong>Orçamento:</strong>
                                                    {v.data.orcamento} MZN
                                                </p>
                                                <p id={styles.categoria}>
                                                    <span id="jogo" className={styles[`a${v.data.categoria.id}`]}></span>
                                                    {v.data.categoria.nome}
                                                </p>
                                                <div id={styles.edicoes}>
                                                    <p
                                                        id={styles.editar}
                                                        onClick={() => {
                                                            navegar(`projeto/${v.id}`);
                                                        }}
                                                    >
                                                        <span>
                                                            <FaPencilAlt />
                                                        </span>
                                                        Editar
                                                    </p>
                                                    <p
                                                        id={styles.remover}
                                                        onClick={() => {
                                                            removeProject(v.id);
                                                            setMensagem("Projeto removido com sucesso!");
                                                            setTimeout(() => {
                                                                setMensagem("");
                                                            }, 2500);
                                                        }}
                                                    >
                                                        <span>
                                                            <FaTrash />
                                                        </span>
                                                        Remover
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <Link className={styles.botao} to="../novo_projeto">
                                <p>Criar novo</p>
                            </Link>
                        </div>
                    ) : (
                        //  Caso não haja nenhum projeto
                        <>
                            <p
                                style={{
                                    color: "#333",
                                    fontWeight: "500",
                                    fontSize: "2em",
                                }}
                            >
                                Ops, você ainda não criou nenhum projeto, vá criar!
                            </p>
                            <motion.img
                                whileHover={{ opacity: 0.9 }}
                                width="260px"
                                height="300px"
                                src={notFound}
                                alt="logo de ops"
                                style={{ marginTop: "2em" }}
                            />
                        </>
                    )}
                </motion.section>
            ) : (
                <img id={estilo.loading} src={spinner} alt="carregando..." />
            )}
        </>
    );
}

export default Projetos;
