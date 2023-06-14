import { Link, NavLink } from "react-router-dom";
import logo from "../../images/costs_logo.png";
import styles from "./NavBar.module.css";
import { motion } from "framer-motion";
import { AuthValue } from "../../context/AuthContext";
import { getAuth } from "firebase/auth";
import { app } from "../../firebase/config";

function NavBar() {
    //  Pegando o valor global do contexto
    const { user, setUser1 } = AuthValue();

    const auth = getAuth(app);

    let activeStyle = {
        textDecoration: "underline",
        backgroundColor: "#ffbb33",
        color: "black",
        transition: ".5s",
        paddingInline: "14px",
        borderRadius: "3px",
    };

    //  Função para deslogar
    async function deslogar(e) {
        e.preventDefault();
        const res = await signOut(auth)
            .then(() => setUser1(undefined))
            .catch((err) => console.log(`Ops, não foi possível deslogar devido a ${err}`));
    }

    return (
        <header id={styles.cabecalho}>
            <ul className={styles.flex}>
                <NavLink to="/">
                    <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        src={logo}
                        alt="Logo do gerenciador de projetos"
                    />
                </NavLink>
                <motion.ul initial={{ y: -200 }} animate={{ y: 0 }} transition={{ duration: 1 }}>
                    <NavLink style={({ isActive }) => (isActive ? activeStyle : undefined)} className={styles.link} to="/">
                        <span>Home</span>
                    </NavLink>
                    <NavLink style={({ isActive }) => (isActive ? activeStyle : undefined)} className={styles.link} to="/sobre">
                        <span>Sobre</span>
                    </NavLink>
                    {!user && (
                        <NavLink style={({ isActive }) => (isActive ? activeStyle : undefined)} className={styles.link} to="/cadastro">
                            <span>Cadastro</span>
                        </NavLink>
                    )}

                    {!user && (
                        <NavLink style={({ isActive }) => (isActive ? activeStyle : undefined)} className={styles.link} to="/entrar">
                            <span>Entrar</span>
                        </NavLink>
                    )}

                    {user && (
                        <NavLink style={({ isActive }) => (isActive ? activeStyle : undefined)} className={styles.link} to="/projetos">
                            <span>Projetos</span>
                        </NavLink>
                    )}
                    {user && <p onClick={deslogar}>Deslogar</p>}
                </motion.ul>
            </ul>
        </header>
    );
}

export default NavBar;
