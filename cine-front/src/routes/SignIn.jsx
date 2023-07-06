import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BounceLoader from "react-spinners/BounceLoader"
import { fetchGetUsuario, fetchLogInUser } from '../components/UseFetch'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-modal'


Modal.setAppElement('#root')

function SignIn() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const navigate = useNavigate()


    const closeModal = () => {
        setShowConfirmation(false)
    }
    const customStyles = {
        overlay: { zIndex: 1000 }
    }
    const onChangeUsername = (e) => setUsername(e.target.value);
    const onChangePassword = (e) => setPassword(e.target.value);
    const onChangeRememberMe = (e) => setRememberMe(e.target.checked)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowConfirmation(true)
        setIsLoading(true)



        if (rememberMe) {
            localStorage.setItem('savedEmail', username);
            localStorage.setItem('savedPassword', password);
            localStorage.setItem('rememberMe', rememberMe);
        } else {
            localStorage.removeItem('savedEmail');
            localStorage.removeItem('savedPassword')
            localStorage.removeItem('rememberMe')
        }

        if ((username == '' || null) || (password == '' || null)){
            setIsLoading(false);
            setMessage('Debe ingresar todos los campos');
            setAccepted(false);
            setTimeout(() => {
                setMessage('')
                setShowConfirmation(false);
            }, 3500)
        }

        try {
            const data = {
                email: username,
                password: password,
            }

            const response = await fetchLogInUser(data);


            if (response != false && response != null) {
                console.log(response);
                if (response.includes('no posee')) {
                    setIsLoading(false);
                    setMessage(response);
                    setAccepted(false);
                    setTimeout(() => {
                        setMessage('')
                        setShowConfirmation(false);
                    }, 3500)
                } else {
                    setAccepted(true);
                    const response = await fetchGetUsuario(username)
                    if (response) {
                        console.log(response)
                        setIsLoading(false);
                        setMessage('¡Inició sesión correctamente!')
                        localStorage.setItem('id',response.id)
                        localStorage.setItem('nombre', response.nombre)
                        localStorage.setItem('apellido', response.apellido)
                        localStorage.setItem('email', response.email)
                        localStorage.setItem('role', response.roles[0].nombre)
                        setTimeout(() => {
                            setMessage('')
                            setShowConfirmation(false);
                            navigate("/");
                        }, 3000)
                    } else {
                        throw new Error("Error al buscar el usuario.");
                    }
                }

            } else {
                setIsLoading(false);
                setMessage('Por favor, verifica tu dirección de correo.')
                setAccepted(false);
                setTimeout(() => {
                    setMessage('')
                    setShowConfirmation(false);
                }, 3000)
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false);
            setMessage("Hubo un error con el servidor. Vuelve a intentarlo.");
            setAccepted(false);
            setTimeout(() => {
                setShowConfirmation(false);
            }, 3500)
        }
    }


    useEffect(() => {
        window.scrollTo(0, 0);
        const savedEmail = localStorage.getItem('savedEmail');
        const savedPassword = localStorage.getItem('savedPassword');
        const savedRememberMe = localStorage.getItem('rememberMe');
        if (savedEmail && savedPassword) {
            setUsername(savedEmail)
            setPassword(savedPassword)
            setRememberMe(savedRememberMe)
        }
    }, [])



    return (
        <div className="sign-in-background">
            <div className="sign-in-container">
                <div className="sign-in">
                    <div className="sign-in-first">
                        <div>
                            <h2>¡Bienvenido!</h2>
                            <p>¡Inicia sesión en tu cuenta!</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <input
                                className="sign-in-inputs"
                                id="input-username"
                                type="email"
                                name="email"
                                placeholder="E-mail"
                                value={username}
                                onChange={onChangeUsername}
                            />
                            <input
                                className="sign-in-inputs"
                                id="input-password"
                                type="password"
                                name="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={onChangePassword}
                            />
                            <div className="remember-me">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={onChangeRememberMe}
                                    />
                                    Recordarme
                                </label>
                                <a>¿Olvidaste tu contraseña?</a>
                            </div>


                            <button className="new-button" type="submit">Iniciar Sesión</button>
                        </form>
                        <div className="register-div">
                            <p>¿Todavía no tienes cuenta?</p>
                            <Link to="../registrarse">
                                Regístrate
                            </Link>
                        </div>
                    </div>
                    <div className="sign-in-second">
                        <p>Disfruta de los estrenos y las mejores películas en nuestros cines. ¡Inicia sesión para obtener ya tu reserva!</p>
                    </div>
                </div>

            </div>
            <Modal
                isOpen={showConfirmation}
                onRequestClose={closeModal}
                contentLabel="Confirmación"
                className="modal"
                style={customStyles}
                shouldCloseOnOverlayClick={false}
            >

                <div className="modal-conteiner">
                    <div className="modal-content-register">
                        {message}
                        {isLoading ? (
                            <BounceLoader
                                color="#36d7b7"
                                speedMultiplier={2}
                                loading
                            />
                        ) : (
                            accepted ? (
                                <img src='./icons/accept.svg' />
                            ) : (
                                <img src='./icons/denied.svg' />
                            )
                        )
                        }
                    </div>
                </div>
            </Modal>
        </div>

    )
}

export default SignIn;