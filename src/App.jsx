import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import NovoProjeto from "./pages/NovoProjeto/NovoProjeto";
import Projetos from "./pages/Projetos/Projetos";
import Projeto from "./pages/Projeto/Projeto";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AuthProvider } from "./context/AuthContext";
import { app } from "./firebase/config";
import Cadastro from "./pages/Cadastro/Cadastro";
import Login from "./pages/Login/Login";
import Sobre from "./pages/Sobre/Sobre";

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
                        <Route path="/sobre" element={<Sobre />} />
                        <Route path="/cadastro" element={!user ? <Cadastro /> : <Navigate to={"/"} />} />
                        <Route path="/entrar" element={!user ? <Login /> : <Navigate to={"/"} />} />
                        <Route path="/projetos" element={user ? <Projetos /> : <Navigate to={"/entrar"} />} />
                        <Route path="/novo_projeto" element={user ? <NovoProjeto /> : <Navigate to={"/entrar"} />} />
                        <Route path="/projetos" element={user ? <Projetos /> : <Navigate to={"/entrar"} />} />
                        <Route path="/projetos/:id" element={user ? <Projeto /> : <Navigate to={"/entrar"} />} />
                    </Routes>
                    <Footer />
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;
