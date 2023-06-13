import { motion } from "framer-motion";

function Empresa() {
    return (
        <motion.section
            initial={{ x: "100vh" }}
            transition={{ duration: 0.5 }}
            animate={{ x: 0 }}
        >
            <h2>Empresa</h2>
        </motion.section>
    );
}

export default Empresa;
