import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import styles from "./Footer.module.css";
import { motion } from "framer-motion";

function Footer() {
    return (
        <footer id={styles.footer}>
            <ul id={styles.flex}>
                <li>
                    <a>
                        <FaFacebook size={30} />
                    </a>
                </li>
                <li>
                    <a>
                        <FaInstagram size={30} />
                    </a>
                </li>
                <li>
                    <a>
                        <FaLinkedin size={30} />
                    </a>
                </li>
            </ul>
            <p>
                © Direitos reservados por{" "}
                <span style={{ color: "#ffbb33", fontWeight: "800" }}>
                    Custos
                </span>{" "}
                - 2022
            </p>
        </footer>
    );
}

export default Footer;
