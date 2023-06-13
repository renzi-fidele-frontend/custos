import styles from "./Home.module.css";
import savings from "../../../images/savings.svg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
    return (
        <section id={styles.flex}>
            <motion.h2
                initial={{ x: -900, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
            >
                Bem-vindo ao <span>Custos</span>
            </motion.h2>
            <p>Começe a gerenciar os seus projetos agora</p>
            <Link to="novo_projeto">
                <motion.p whileHover={{ scale: 1.2 }}>Criar novo</motion.p>
            </Link>
            <motion.img
                initial={{ opacity: 0, scale: 0.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                src={savings}
                alt="Foto do menu principal"
                id={styles.imagem}
            />
        </section>
    );
}

export default Home;
