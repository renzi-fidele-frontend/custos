import styles from "./Projetos.module.css";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import skull from "../../../images/skull.svg";

function Projetos() {
    const location = useLocation();

    const navegar = useNavigate();

    const [meusProjetos, setMeusProjetos] = useState([]);

    //  Mensagem que de sucesso de remoção
    const [mensagem, setMensagem] = useState("");

    //  Mensagem de sucesso de criação de projeto
    const [msg_sucesso, setMsg_sucesso] = useState("");


    useEffect(() => {
        //  Apanhando os projetos na api
        fetch("http://localhost:5000/projetos", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((val) => val.json())
            .then((val) => {
                setMeusProjetos(val);
            })
            .catch((err) => console.log(`Ops, aconteceu o erro : ${err}`));

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
                setMeusProjetos(
                    meusProjetos.filter((projeto) => projeto.id !== id)
                );
            })
            .catch((err) => console.log(`Ops, aconteceu o erro: ${err}`));
    }

    return (
        <motion.section
            initial={{ x: "200vh" }}
            transition={{ duration: 0.6 }}
            animate={{ x: 0 }}
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
            {mensagem.length > 0 && (
                <span className={styles.removido}>{mensagem}</span>
            )}

            {/*Caso haja algum projeto*/}
            {meusProjetos.length > 0 ? (
                <div id={styles.flex}>
                    <div id={styles.col}>
                        <h2>Meus projetos</h2>
                        <div id={styles.projects_container}>
                            {meusProjetos.map((v, index) => {
                                return (
                                    <div key={index} className={styles.project_card}>
                                        <h2 id={styles.nome}>
                                            {v.nomeProjeto}
                                        </h2>
                                        <p id={styles.orcamento}>
                                            <strong>Orçamento:</strong>
                                            {v.orcamento} MZN
                                        </p>
                                        <p id={styles.categoria}>
                                            <span
                                                id="jogo"
                                                className={
                                                    styles[`a${v.categoria.id}`]
                                                }
                                            ></span>
                                            {v.categoria.nome}
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
                                                    setMensagem(
                                                        "Projeto removido com sucesso!"
                                                    );
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
                        src={skull}
                        alt="logo de ops"
                        style={{ marginTop: "2em" }}
                    />
                </>
            )}
        </motion.section>
    );
}

export default Projetos;
