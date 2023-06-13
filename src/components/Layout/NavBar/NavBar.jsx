import { Link, NavLink } from "react-router-dom";
import logo from "../../../images/costs_logo.png";
import styles from "./NavBar.module.css";
import { motion } from "framer-motion";

function NavBar() {
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
                <motion.ul
                    initial={{ y: -200 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <NavLink className={styles.link} to="/">
                        <motion.span
                            whileHover={{ fontSize: "22px" }}
                            transition={{ duration: 0.2 }}
                        >
                            Home
                        </motion.span>
                    </NavLink>
                    <NavLink className={styles.link} to="/contacto">
                        <motion.span
                            whileHover={{ fontSize: "22px" }}
                            transition={{ duration: 0.2 }}
                        >
                            Contacto
                        </motion.span>
                    </NavLink>
                    <NavLink className={styles.link} to="/empresa">
                        <motion.span
                            whileHover={{ fontSize: "22px" }}
                            transition={{ duration: 0.2 }}
                        >
                            Empresa
                        </motion.span>
                    </NavLink>
                    <NavLink className={styles.link} to="/projetos">
                        <motion.span
                            whileHover={{ fontSize: "22px" }}
                            transition={{ duration: 0.2 }}
                        >
                            Projetos
                        </motion.span>
                    </NavLink>
                </motion.ul>
            </ul>
        </header>
    );
}

export default NavBar;
