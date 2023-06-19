import { useState } from "react";
import styles from "./NovoProjeto.module.css";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Timestamp, addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { AuthValue } from "../../context/AuthContext";
import spinner from "../../images/spin.svg";
import foto from "../../images/criarProjeto.svg"

function NovoProjeto() {
    //  Usando o useNavigate
    const navegar = useNavigate();

    //  Pegando o user do contexto global
    const { user } = AuthValue();

    const [loading, setLoading] = useState(false);

    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState(undefined);
    const [orcamento, setorcamento] = useState("");

    const [categorias, setCategorias] = useState([]);

    async function apanharCategorias() {
        let q = doc(db, "categorias", "khT7a4sNOD1oaFA5SH6G");

        let captura = await getDoc(q);

        if (captura.exists()) {
            console.log(captura.data().categorias);
            setCategorias(captura.data().categorias);
        } else {
            console.log("O documento não existe");
        }
    }

    //  Apanhando as categorias no DB
    useEffect(() => {
        apanharCategorias();
    }, []);

    //  Enviando os dados do projeto
    async function send() {
        setLoading(true);
        //  Adicionando a publicação à base de dados
        const docRef = await addDoc(collection(db, "projetos"), {
            custo: 0,
            servicos: [],
            titulo: nome,
            criadoEm: Timestamp.now(),
            orcamento: orcamento,
            ownerId: user.uid,
            categoria: categoria,
        })
            .then(() => {
                setLoading(false);
                //  Resetando os campos de preenchimento
                setNome("");
                setorcamento(0);

                navegar("/projetos", {
                    state: "O seu projeto foi criado com sucesso!",
                });
            })
            .catch((err) => {
                console.log(`Ops, o erro foi de: ${err}`);
            });
    }

    return (
        <>
            {loading === false ? (
                <motion.section initial={{ x: "100vh" }} transition={{ duration: 0.5 }} animate={{ x: 0 }} id={styles.container}>
                    <div id={styles.align}>
                        <h2>Criar projeto</h2>
                        <p>Crie seus projetos para depois adicionar os serviços</p>
                        <div id={styles.linha}>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    send();
                                }}
                                id={styles.formulario}
                            >
                                <div className={styles.afastar}>
                                    <label className={styles.label} htmlFor="nomeProjeto">
                                        Nome do projeto:
                                    </label>
                                    <motion.input
                                        whileFocus={{ backgroundColor: "#ffe14d" }}
                                        transition={{ duration: 0.5 }}
                                        type="text"
                                        name="nomeProjeto"
                                        id="nomeProjeto"
                                        placeholder="Insira o nome do projeto"
                                        className={styles.input}
                                        onChange={(e) => {
                                            setNome(e.target.value);
                                        }}
                                        value={nome}
                                        required
                                    />
                                </div>
                                <div className={styles.afastar}>
                                    <label className={styles.label} htmlFor="orcamento">
                                        Orçamento do projeto:
                                    </label>
                                    <motion.input
                                        whileFocus={{ backgroundColor: "#ffe14d" }}
                                        transition={{ duration: 0.5 }}
                                        type="number"
                                        name="orcamento"
                                        id="orcamento"
                                        onChange={(e) => {
                                            setorcamento(e.target.value);
                                        }}
                                        value={orcamento}
                                        placeholder="Insira o orçamento total"
                                        className={styles.input}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="category_id" className={styles.label}>
                                        Selecione a categoria:
                                    </label>
                                    <motion.select
                                        whileTap={{ backgroundColor: "#faf7dd" }}
                                        transition={{ duration: 0.5 }}
                                        onChange={(e) => {
                                            categorias.forEach((v) => {
                                                if (e.target.options[e.target.selectedIndex].text === v.nome) {
                                                    console.log(v);
                                                    setCategoria(v);
                                                }
                                            });
                                        }}
                                        className={styles.select}
                                        name="category_id"
                                    >
                                        <option disabled selected>
                                            Selecione a categoria
                                        </option>
                                        {categorias.map((e) => {
                                            return (
                                                <option value={e.id} key={e.id}>
                                                    {e.nome}
                                                </option>
                                            );
                                        })}
                                    </motion.select>
                                </div>
                                <div>
                                    <motion.button whileHover={{ scale: 1.2, color: "#ffbb33" }} id={styles.botao} type="submit">
                                        Criar projeto
                                    </motion.button>
                                </div>
                            </form>
                            <img src={foto} alt="ilustracao para criar projeto" />
                        </div>
                    </div>
                </motion.section>
            ) : (
                <img id={styles.loading} src={spinner} alt="carregando..." />
            )}
        </>
    );
}

export default NovoProjeto;
