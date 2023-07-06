import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import ModalGlobal from "./GlobalModal";
import Accordion from "./Accordion";

const DropdownProfile = () => {
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('')
    const [active, setActive] = useState(false)
    let menuRef = useRef();
    const navigate = useNavigate()

    const handleActive = (index, act) => {
        setActive(act)
    }

    const closeModal = () => {
        setShowConfirmation(false)
    }

    const handleConfirm = (confirm) => {
        setShowConfirmation(true)
        if (confirm) {
            localStorage.clear()
            setMessage(
                <div className="reserve-content">
                <div className="reserve-box">
                <div className="modal-content-register">
                    ¡Cerró sesión correctamente!
                    <img src='/icons/accept.svg' />
                </div>
                </div>
                </div>
            )
            setTimeout(() => {
                setShowConfirmation(false)
                setMessage('')
                navigate('/')
            }, 3000)
        } else {
            setMessage('')
            setShowConfirmation(false)
        }
    }

    const handleShowConfirmation = () => {
        setShowConfirmation(true)
        setMessage(
            <div className="reserve-content">
                <div className="reserve-box">
                    <h3>¿Seguro que quieres cerrar sesión?</h3>
                    <div className="modal-buttons">
                    <button onClick={() => handleConfirm(true)}>Sí</button>
                    <button onClick={() => handleConfirm(false)}>No</button>
                </div>
                </div>
                
            </div>
        )
    }

    useEffect(() => {
        let handler = (e) => {
            if (!menuRef.current.contains(e.target)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handler)

        return () => {
            document.removeEventListener("mousedown", handler)
        }
    }, [])

    return (
        <div className="account-container" ref={menuRef}>

            <div className="account-trigger" onClick={() => { setOpen(!open) }}>
                {!localStorage.getItem('role') ?
                    (<img src="/icons/account-icon.svg" />)
                    :
                    <div>{localStorage.getItem('nombre').charAt(0)}{localStorage.getItem('apellido').charAt(0)} </div>
                }
            </div>
            <div className={`drop-down-profile ${open ? 'active' : 'inactive'}`}>
                <ul>
                    {localStorage.getItem('role') &&

                        <li className="drop-down-new-item">
                            <Accordion
                                title="Perfil"
                                active={active}
                                onChange={handleActive}
                                index={0}
                                content={
                                    <ul>
                                        <Link to='/perfil'>
                                            <li>Configuración</li>
                                        </Link>
                                        <Link to='/favoritos'>
                                            <li>Favoritos</li>
                                        </Link>
                                        <Link to='/reservas'>
                                            <li id="padding-problem">Reservas</li>
                                        </Link>
                                    </ul>
                                }
                            />
                        </li>

                    }
                    {!localStorage.getItem('role') &&
                        <Link to='/inicio-sesion'>
                            <li className="drop-down-item">Iniciar Sesión</li>
                        </Link>
                    }
                    {!localStorage.getItem('role') &&
                        <Link to='/registrarse'>
                            <li className="drop-down-item">Crear Cuenta</li>
                        </Link>
                    }
                    {localStorage.getItem('role') == 'ADMIN' &&
                        <Link to='/admin'>
                            <li className="drop-down-item">Panel de Administrador</li>
                        </Link>
                    }
                    {localStorage.getItem('role') &&
                        <li className="drop-down-item" onClick={handleShowConfirmation}>Cerrar Sesión</li>
                    }

                </ul>
            </div>

            <ModalGlobal
                showConfirmation={showConfirmation}
                closeModal={closeModal}
                message={message}
                shouldClose={false}
            />

        </div>

    )
}

export default DropdownProfile;