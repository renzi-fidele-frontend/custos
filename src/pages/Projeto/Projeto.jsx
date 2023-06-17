import styles from "./Projeto.module.css";
import { motion } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import estilo from "../NovoProjeto/NovoProjeto.module.css";
import estilo2 from "../Projetos/Projetos.module.css";
import { IoCaretBack } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { Timestamp, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import spinner from "../../images/spin.svg";

function Projeto() {
    //  Hook para pegar parametros da url
    const id = useParams().id;

    //  Pegando os dados do projeto
    const projeto = useLocation().state;

    //  Mensagem que de sucesso de remoção de servico
    const [msgServico, setMsgServico] = useState("");

    //  Hook para pegar as categorias
    const [categorias, setCategorias] = useState([]);

    //  Hook para pegar os serviços

    //  Hook do projeto atualizado
    const [projetoAtualizado, setProjetoAtualizado] = useState({});

    //  Hook para trocar entre Form/dados do projeto
    const [editar, seteditar] = useState(false);

    //  Hook para trocar entre Form/opção de adicionar serviços
    const [adicionar, setAdicionar] = useState(false);

    //  Hook para enviar a mensagem de salvamento com sucesso
    const [salvo, setSalvo] = useState(false);

    //  Hook para enviar a mensagem de adição de serviço
    const [adicionado, setAdicionado] = useState(false);

    //  Hook para enviar a mensagem de erro de salvamento
    const [erroSalvo, setErroSalvo] = useState(false);

    //  Usando o useNavigate para redicionar para outra página
    const navegar = useNavigate();

    const [loading, setLoading] = useState(false);

    //  Mensagem que de sucesso de remoção
    const [mensagem, setMensagem] = useState("");

    //  Erro ao se criar um serviço
    const [msgErroServico, setMsgErroServico] = useState("");

    //  Hooks do form
    const [nome, setNome] = useState(projeto.data.titulo);
    const [categoria, setCategoria] = useState(projeto.data.categoria);
    const [orcamento, setOrcamento] = useState(projeto.data.orcamento);
    const [custoTotal, setCustoTotal] = useState(projeto.data.custo);
    const [servicos, setServicos] = useState(projeto.data.servicos);

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

    useEffect(() => {
        apanharCategorias();
    }, []);

    //  Adicionando um serviço
    async function adicionarServico(e) {
        e.preventDefault();
        let novo_total = custoTotal + parseFloat(document.querySelector("#custo").value);

        //  Caso o custo do serviço a adicionar seja menor do que o orcamento
        if (novo_total <= orcamento) {
            //  Adicionando o servico
            const Ref = doc(db, "projetos", id);

            await updateDoc(Ref, {
                servicos: arrayUnion({
                    nome: document.querySelector("#nomeServico").value,
                    custo: document.querySelector("#custo").value,
                    descricao: document.querySelector("#descricao").value,
                }),
            });

            console.log({
                nome: document.querySelector("#nomeServico").value,
                custo: document.querySelector("#custo").value,
                descricao: document.querySelector("#descricao").value,
            });

            setAdicionado(true);
            setTimeout(() => {
                setAdicionado(false);
            }, 3000);

            //  Atualizando na dashboard
            setCustoTotal();

            //  Resetando os dados do formulário
            document.querySelector("#nomeServico").value = "";
            document.querySelector("#custo").value = "";
            document.querySelector("#descricao").value = "";

            setAdicionar(false);
        } else {
            console.log("Ops, O orcamento não é suficiente");
            setMsgErroServico("O valor do orçamento não é suficiente");
            setTimeout(() => {
                setMsgErroServico("");
            }, 2000);
        }
    }

    //  Removendo um Serviço
    function removeServico(key) {
        let novoTotal = parseFloat(custoTotal);
        let newService = servicos.filter((v, index) => {
            if (index == key) {
                novoTotal -= parseFloat(v.custo);
                return false;
            } else {
                return true;
            }
        });
        setServicos(newService);

        console.log(key, newService);
        projetoAtualizado.servicos = newService;
        projetoAtualizado.custo = novoTotal;

        setCustoTotal(novoTotal);

        //  Atualizando o serviço no banco de dados e o valor subtraido
        fetch(`http://localhost:5000/projetos/${projeto.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(projetoAtualizado),
        })
            .then((v) => v.json())
            .then((v) => console.log(v))
            .catch((err) => {
                console.log(`Ops, aconteceu o erro: ${err}`);
            });
    }

    //  Atualizando/Salvando o projeto
    async function update(e) {
        e.preventDefault();
        setLoading(true);
        //  Caso o valor do orçamento suporte o custo total ou não
        if (projeto.data.orcamento >= custoTotal) {
            const Ref = doc(db, "projetos", id);
            await updateDoc(Ref, {
                titulo: nome,
                orcamento: orcamento,
                categoria: categoria,
                custo: custoTotal,
            });

            setLoading(false);
            seteditar(false);
            setSalvo(true);
            setTimeout(() => {
                setSalvo(false);
            }, 4000);
        } else {
            setErroSalvo(true);
            setTimeout(() => {
                setErroSalvo(false);
            }, 4000);
        }
    }

    return (
        <>
            {loading === false ? (
                <motion.section
                    initial={{ opacity: 0 }}
                    transition={{ duration: 1.4 }}
                    animate={{ opacity: 1 }}
                    style={{ minHeight: "80vh", marginInline: "6%", textAlign: "left" }}
                >
                    <div id={styles.sec}>
                        <div className={styles.project_container}>
                            <h1 id={styles.nome}>{nome}</h1>
                            {/*Exibição inicial */}
                            {editar === false ? (
                                <ul>
                                    <li>
                                        <strong>Categoria:</strong> {categoria.nome}
                                    </li>
                                    <li>
                                        <strong>Total do orçamento:</strong> {orcamento} MZN
                                    </li>
                                    <li>
                                        <strong>Total gasto:</strong> {custoTotal} MZN
                                    </li>
                                </ul>
                            ) : (
                                //  Formulário para editar o projeto
                                <form onSubmit={update} style={{ marginBlock: "2.5em" }} id={estilo.formulario}>
                                    <div
                                        className={estilo.afastar}
                                        style={{
                                            display: "flex",
                                            flexFlow: "column nowrap",
                                        }}
                                    >
                                        <label className={estilo.label} htmlFor="nomeProjeto">
                                            Nome do projeto:
                                        </label>
                                        <motion.input
                                            whileFocus={{
                                                backgroundColor: "#ffe14d",
                                            }}
                                            transition={{ duration: 0.5 }}
                                            type="text"
                                            defaultValue={nome}
                                            name="nomeProjeto"
                                            id="nomeProjeto"
                                            placeholder="Insira o nome do projeto"
                                            className={estilo.input}
                                            value={nome}
                                            onChange={(e) => {
                                                setNome(e.target.value);
                                            }}
                                            required
                                            style={{ width: "550px" }}
                                        />
                                    </div>
                                    <div
                                        className={estilo.afastar}
                                        style={{
                                            display: "flex",
                                            flexFlow: "column nowrap",
                                        }}
                                    >
                                        <label className={estilo.label} htmlFor="orcamento">
                                            Orçamento do projeto:
                                        </label>
                                        <motion.input
                                            whileFocus={{
                                                backgroundColor: "#ffe14d",
                                            }}
                                            transition={{ duration: 0.5 }}
                                            defaultValue={orcamento}
                                            type="number"
                                            name="orcamento"
                                            id="orcamento"
                                            placeholder="Insira o orçamento total"
                                            className={estilo.input}
                                            onChange={(e) => {
                                                setOrcamento(e.target.value);
                                            }}
                                            required
                                            style={{ width: "550px" }}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexFlow: "column nowrap",
                                        }}
                                    >
                                        <label htmlFor="category_id" className={estilo.label}>
                                            Selecione a categoria:
                                        </label>
                                        <motion.select
                                            style={{ width: "550px" }}
                                            whileTap={{
                                                backgroundColor: "#faf7dd",
                                            }}
                                            transition={{ duration: 0.5 }}
                                            className={estilo.select}
                                            name="category_id"
                                            onChange={(e) => {
                                                categorias.forEach((v) => {
                                                    if (e.target.options[e.target.selectedIndex].text === v.nome) {
                                                        console.log(v);
                                                        setCategoria(v);
                                                    }
                                                });
                                            }}
                                        >
                                            <option disabled selected>
                                                Selecione a categoria
                                            </option>
                                            {categorias.map((e) => {
                                                if (projeto.data.categoria.id == e.id) {
                                                    return (
                                                        <option selected value={e.id} key={e.id}>
                                                            {e.nome}
                                                        </option>
                                                    );
                                                } else {
                                                    return (
                                                        <option value={e.id} key={e.id}>
                                                            {e.nome}
                                                        </option>
                                                    );
                                                }
                                            })}
                                        </motion.select>
                                    </div>
                                    <motion.button
                                        whileHover={{
                                            scale: 1.2,
                                            color: "#ffbb33",
                                        }}
                                        style={{
                                            alignSelf: "start",
                                            marginTop: "20px",
                                        }}
                                        id={estilo.botao}
                                        transition={{ duration: 0.2 }}
                                        type="submit"
                                    >
                                        Salvar projeto
                                    </motion.button>
                                </form>
                            )}
                        </div>

                        <p
                            id={styles.botao}
                            onClick={() => {
                                editar === true ? seteditar(false) : seteditar(true);
                            }}
                        >
                            {editar === true ? "Fechar" : "Editar projeto"}
                        </p>
                    </div>
                    <hr id={styles.barra} />
                    <div id={styles.div}>
                        <div>
                            <div>
                                {/*Caso queira adicionar um serviço ou não */}
                                {adicionar == true ? (
                                    //  Formulário para adicionar serviço
                                    <form style={{ marginBlock: ".3em" }} id={estilo.formulario} onSubmit={adicionarServico}>
                                        <div
                                            className={estilo.afastar}
                                            style={{
                                                display: "flex",
                                                flexFlow: "column nowrap",
                                            }}
                                        >
                                            <label className={estilo.label} htmlFor="nomeServico">
                                                Nome do serviço:
                                            </label>
                                            <motion.input
                                                whileFocus={{
                                                    backgroundColor: "#ffe14d",
                                                }}
                                                transition={{ duration: 0.5 }}
                                                type="text"
                                                name="nomeServico"
                                                id="nomeServico"
                                                placeholder="Insira o nome do serviço"
                                                className={estilo.input}
                                                required
                                                style={{ width: "420px" }}
                                            />
                                        </div>
                                        <div
                                            className={estilo.afastar}
                                            style={{
                                                display: "flex",
                                                flexFlow: "column nowrap",
                                            }}
                                        >
                                            <label className={estilo.label} htmlFor="custo">
                                                Custo do serviço:
                                            </label>
                                            <motion.input
                                                whileFocus={{
                                                    backgroundColor: "#ffe14d",
                                                }}
                                                transition={{ duration: 0.5 }}
                                                type="number"
                                                name="custo"
                                                id="custo"
                                                placeholder="Insira o custo total do serviço"
                                                className={estilo.input}
                                                required
                                                style={{ width: "420px" }}
                                            />
                                        </div>
                                        <div
                                            className={estilo.afastar}
                                            style={{
                                                display: "flex",
                                                flexFlow: "column nowrap",
                                            }}
                                        >
                                            <label className={estilo.label} htmlFor="descricao">
                                                Descrição do serviço:
                                            </label>
                                            <motion.input
                                                whileFocus={{
                                                    backgroundColor: "#ffe14d",
                                                }}
                                                transition={{ duration: 0.5 }}
                                                type="text"
                                                name="descricao"
                                                id="descricao"
                                                placeholder="Insira a descrição do serviço"
                                                className={estilo.input}
                                                required
                                                style={{ width: "420px" }}
                                            />
                                        </div>
                                        <motion.button
                                            whileHover={{
                                                scale: 1.05,
                                                color: "#ffbb33",
                                            }}
                                            style={{
                                                alignSelf: "start",
                                                marginTop: "1px",
                                            }}
                                            id={estilo.botao}
                                            onSubmit={adicionarServico}
                                            transition={{ duration: 0.2 }}
                                            type="submit"
                                        >
                                            Adicionar
                                        </motion.button>
                                    </form>
                                ) : (
                                    <h2>Adicione um Serviço: </h2>
                                )}

                                <p
                                    id={styles.botao}
                                    style={{ margin: 0 }}
                                    onClick={() => {
                                        adicionar === true ? setAdicionar(false) : setAdicionar(true);
                                    }}
                                >
                                    {adicionar === true ? "Fechar" : "Adicionar serviço"}
                                </p>
                                {/*Caso se adicione um serviço*/}
                                {adicionado === true && (
                                    <motion.p
                                        transition={{ duration: 0.5 }}
                                        initial={{ opacity: 0, x: "100vh" }}
                                        animate={{ opacity: 1, x: "90vh" }}
                                        style={{
                                            backgroundColor: "#38a57b",
                                            color: "white",
                                            textAlign: "end",
                                            marginTop: "2em",
                                            margin: "2em auto",
                                            paddingInline: "3em",
                                            fontWeight: "500",
                                            paddingBlock: "1em",
                                            position: "absolute",
                                        }}
                                    >
                                        Servico adicionado com sucesso!
                                    </motion.p>
                                )}

                                {/*Caso haja erro ao se adicionar um serviço */}
                                {msgErroServico.length > 0 && (
                                    <motion.p
                                        transition={{ duration: 0.5 }}
                                        initial={{ opacity: 0, x: "100vh" }}
                                        animate={{ opacity: 1, x: "90vh" }}
                                        style={{
                                            backgroundColor: "#d14e49",
                                            color: "white",
                                            marginTop: "2em",
                                            margin: "2em auto",
                                            paddingInline: "3em",
                                            fontWeight: "500",
                                            paddingBlock: "1em",
                                            position: "absolute",
                                        }}
                                    >
                                        {msgErroServico}
                                    </motion.p>
                                )}
                            </div>
                            <hr />
                            <h2 style={{ margin: "16px 0px 0px 0px" }}>Serviços</h2>
                            <div id={styles.servicos_container}></div>
                        </div>
                        <motion.p
                            whileHover={{ scale: 1.1, opacity: 0.7, color: "#ffbb33" }}
                            style={{
                                backgroundColor: "#686764",
                                width: "fit-content",
                                fontSize: "16px",
                                marginTop: "9px",
                                fontWeight: "500",
                                alignSelf: "baseline",
                            }}
                            id={estilo.botao}
                            onClick={() => {
                                navegar("../projetos");
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            {<IoCaretBack style={{ marginRight: "7px", fontSize: "15px" }} />} Voltar
                        </motion.p>
                    </div>
                    {/*Caso haja algum serviço */}
                    {servicos.length > 0 ? (
                        <div id={estilo2.projects_container} style={{ margin: "0", marginBottom: "1em" }}>
                            {servicos.map((v, index) => {
                                return (
                                    <div key={index + 1} className={estilo2.project_card}>
                                        <h2 id={estilo2.nome}>{v.nome}</h2>
                                        <p id={estilo2.orcamento}>
                                            <strong>Custo total:</strong>
                                            {v.custo} MZN
                                        </p>
                                        <p id={estilo2.categoria}>{v.descricao}</p>
                                        <p
                                            id={estilo2.remover}
                                            style={{
                                                border: "1px solid black",
                                                padding: "2px 6px",
                                                fontSize: "1em",
                                                transition: "all ease-out 0.3s",
                                                alignSelf: "start",
                                                marginLeft: 0,
                                            }}
                                            onClick={() => {
                                                //  Removendo o serviço
                                                removeServico(index);
                                                setMsgServico("Serviço removido com sucesso!");
                                                setTimeout(() => {
                                                    setMsgServico("");
                                                }, 3000);
                                            }}
                                        >
                                            <span>
                                                <FaTrash />
                                            </span>
                                            Remover
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        //  Caso não haja nenhum
                        <p>Não há nenhum serviço</p>
                    )}

                    {/*Caso o projeto seja salvo */}
                    {salvo === true && (
                        <motion.p
                            transition={{ duration: 0.5 }}
                            initial={{ opacity: 0, y: 200 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                backgroundColor: "#38a57b",
                                color: "white",
                                marginTop: "2em",
                                margin: "2em auto",
                                paddingInline: "3em",
                                position: "absolute",
                                fontWeight: "500",
                                paddingBlock: "1em",
                            }}
                        >
                            Projeto salvo com sucesso
                        </motion.p>
                    )}

                    {/*Caso o projeto mande erro no salvamento */}
                    {erroSalvo === true && (
                        <motion.p
                            transition={{ duration: 0.5 }}
                            initial={{ opacity: 0, y: 200 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                backgroundColor: "#d14e49",
                                color: "white",
                                width: "40%",
                                marginTop: "2em",
                                margin: "2em auto",
                                paddingInline: "3em",
                                fontWeight: "500",
                                paddingBlock: "1em",
                            }}
                        >
                            O orçamento não é suficiente, reduza os serviços ou aumente o valor
                        </motion.p>
                    )}

                    {/*Caso haja uma mensagem de remoção de serviço */}
                    {msgServico.length > 0 && (
                        <motion.span
                            initial={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                            animate={{ opacity: 0 }}
                            className={estilo2.removido}
                        >
                            {msgServico}
                        </motion.span>
                    )}
                </motion.section>
            ) : (
                <img id={estilo.loading} src={spinner} alt="carregando..." />
            )}
        </>
    );
}

export default Projeto;
