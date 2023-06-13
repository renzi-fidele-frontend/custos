import styles from "./Contacto.module.css";
import { motion } from "framer-motion";

function Contacto() {
    return (
        <motion.section
            initial={{ x: "100vh" }}
            transition={{ duration: 0.3 }}
            animate={{ x: 0 }}
        >
            <h2>Contacto</h2>
        </motion.section>
    );
}

export default Contacto;
