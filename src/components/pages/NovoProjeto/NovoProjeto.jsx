import { useState } from "react";
import styles from "./NovoProjeto.module.css";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NovoProjeto() {
    //  Usando o useNavigate
    const navegar = useNavigate();

    //  Incicializando o custo e serviços
    const [projeto, setProjeto] = useState({ custo: 0, servicos: [] });

    const [categorias, setCategorias] = useState([]);

    //  Apanhando as categorias na api
    useEffect(() => {
        fetch("http://localhost:5000/categorias", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((val) => val.json())
            .then((val) => {
                setCategorias(val);
            })
            .catch((err) => {
                console.log(`Ops, aconteceu o erro: ${err}`);
            });
    }, []);

    //  Passando o nome em forma de objecto na mudanca
    function handleChange(e) {
        setProjeto({ ...projeto, [e.target.name]: e.target.value });
    }

    //  Passando a categoria
    function handleCategory(e) {
        setProjeto({
            ...projeto,
            categoria: {
                id: e.target.value,
                nome: e.target.options[e.target.selectedIndex].text,
            },
        });
    }
    //  Enviando os dados do projeto
    function send() {
        fetch("http://localhost:5000/projetos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(projeto),
        })
            .then((rsp) => rsp.json())
            .then(() => {
                navegar("/projetos", {
                    state: "O seu projeto foi criado com sucesso!",
                });
            })
            .catch((err) => {
                console.log(`Ops, o erro foi de: ${err}`);
            });

        //  Resetando os campos de preenchimento
        document.querySelector("#nomeProjeto").value = "";
        document.querySelector("#orcamento").value = "";
    }

    return (
        <motion.section initial={{ x: "100vh" }} transition={{ duration: 0.5 }} animate={{ x: 0 }} id={styles.container}>
            <div id={styles.align}>
                <h2>Criar projeto</h2>
                <p>Crie seus projetos para depois adicionar os serviços</p>

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
                            onChange={handleChange}
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
                            onChange={handleChange}
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
                            onChange={handleCategory}
                            className={styles.select}
                            name="category_id"
                        >
                            <option disabled selected>
                                Selecione a categoria
                            </option>
                            {categorias.map((e) => {
                                return (
                                    <option value={e.id} key={e.id}>
                                        {e.name}
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
            </div>
        </motion.section>
    );
}

export default NovoProjeto;
