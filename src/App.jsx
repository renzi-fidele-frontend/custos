import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home/Home";
import Contacto from "./components/pages/Contacto/Contacto";
import Empresa from "./components/pages/Empresa/Empresa";
import NovoProjeto from "./components/pages/NovoProjeto/NovoProjeto";
import NavBar from "./components/Layout/NavBar/NavBar";
import Projetos from "./components/pages/Projetos/Projetos";
import Footer from "./components/Layout/Footer/Footer";
import Projeto from "./components/pages/Projeto/Projeto";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AuthProvider } from "./context/AuthContext";
import { app } from "./firebase/config";

function App() {
    const [user, setUser] = useState(undefined);
    const auth = getAuth(app);

    useEffect(() => {
        //  Função que mapeia se a autenticação foi feita com sucesso
        onAuthStateChanged(auth, (usr) => {
            console.log(`Houve uma mudança de estado, ${usr}`);
            setUser(usr);
        });
    }, [auth]);

    function setUser1(val) {
        setUser(val);
    }

    return (
        <div className="App">
            <Router>
                <AuthProvider value={{ user, setUser1 }}>
                    <NavBar />
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route path="/contacto" element={<Contacto />} />
                        <Route path="/empresa" element={<Empresa />} />
                        <Route path="/novo_projeto" element={<NovoProjeto />} />
                        <Route path="/projetos" element={<Projetos />} />
                        <Route path="/projetos/projeto/:id" element={<Projeto />} />
                    </Routes>
                    <Footer />
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;
