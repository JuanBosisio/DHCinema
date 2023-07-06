import { useForm } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import Modal from 'react-modal'
import { useState } from 'react'
import BounceLoader from "react-spinners/BounceLoader"
import { fetchRegisterUser } from '../components/UseFetch'
import { useNavigate } from 'react-router-dom'

Modal.setAppElement('#root')

const schema = yup.object({
    nombre: yup.string()
        .required('Se requiere un nombre.')
        .matches(/^[a-zA-ZÀ-ÿ\s]/, 'El nombre no puede poseer caracteres especiales o números.'),
    apellido: yup.string()
        .required('Se requiere un apellido.')
        .matches(/^[a-zA-ZÀ-ÿ\s]/, 'El nombre no puede poseer caracteres especiales o números.'),
    email: yup.string()
        .required('Se requiere un email.')
        .matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, 'Se requiere un email válido.'),
    confirmacionEmail: yup.string()
        .required('Se requiere este campo.')
        .matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, 'Se requiere un email válido.')
        .oneOf([yup.ref('email')], 'Los emails no coinciden entre si.'),
    password: yup.string()
        .required('Se requiere una contraseña.')
        .min(6, 'La contraseña debe ser mayor a 6 caracteres.'),
    contraseñaConfirmacion: yup.string()
        .required('Se requiere este campo.')
        .min(6, 'La contraseña debe ser mayor a 6 caracteres.')
        .oneOf([yup.ref('password')], 'Las contraseñas no coinciden entre sí.'),
})

function Register() {
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

    window.scrollTo(0, 0);

    const { register, formState: { errors }, handleSubmit } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async data => {
        setShowConfirmation(true);
        setIsLoading(true);
        const newData = data
        delete newData.confirmacionEmail;
        delete newData.contraseñaConfirmacion;
        try {

            const response = await fetchRegisterUser(newData);

            if (response != false && response != null) {
                console.log(response);
                if (response.includes('Ya existe')) {
                    setIsLoading(false);
                    setMessage(response);
                    setAccepted(false);
                    setTimeout(() => {
                        setMessage('')
                        setShowConfirmation(false);
                    }, 3500)
                } else {
                    setIsLoading(false);
                    setMessage(response);
                    setAccepted(true);
                    setTimeout(() => {
                        setMessage('')
                        setAccepted(false)
                        setShowConfirmation(false);
                        navigate("/inicio-sesion");
                    }, 3500)
                }

            } else {
                setIsLoading(false);
                setMessage(response);
                setAccepted(false);
                setTimeout(() => {
                    setMessage('')
                    setShowConfirmation(false);
                }, 3500)
            }
        } catch (error) {
            setIsLoading(false);
            setTimeout(() => {
                setMessage("Hubo un error con el registro. Vuelva a intentarlo.");
                setAccepted(false);
            }, 3500)
            setShowConfirmation(false);
        }
    }


    return (
        <div className='register'>
            <div className="register-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h3>Registro</h3>
                    <div className="register-seccion1">
                        <div>
                            <input
                                placeholder="Nombre"
                                type='text'
                                className={` ${errors.nombre ? 'error-input' : 'register-input'}`}
                                {...register('nombre')}
                                aria-invalid={errors.nombre ? "true" : "false"}

                            />
                            <p>{errors.nombre?.message}</p>
                        </div>
                        <div>

                            <input
                                className={`${errors.apellido ? 'error-input' : 'register-input'}`}
                                placeholder="Apellido"
                                type='text'
                                {...register('apellido')}
                                aria-invalid={errors.apellido ? "true" : "false"}
                            />
                            <p>{errors.apellido?.message}</p>
                        </div>
                    </div>
                    <div className='register-seccion2'>
                        <div>
                            <input
                                className={`${errors.email ? 'error-input' : 'register-input'}`}
                                placeholder="E-mail"
                                type='email'
                                {...register('email')}
                                aria-invalid={errors.email ? "true" : "false"}
                            />
                            <p>{errors.email?.message}</p>
                        </div>
                        <div>
                            <input
                                className={`${errors.confirmacionEmail ? 'error-input' : 'register-input'}`}
                                placeholder="Confirmación e-mail"
                                type='email'
                                {...register('confirmacionEmail')}
                                aria-invalid={errors.confirmacionEmail ? "true" : "false"}
                            />
                            <p>{errors.confirmacionEmail?.message}</p>
                        </div>
                        <div>
                            <input
                                className={`${errors.contraseña ? 'error-input' : 'register-input'}`}
                                placeholder="Contraseña"
                                type='password'
                                {...register('password')}
                                aria-invalid={errors.contraseña ? "true" : "false"}
                            />
                            <p>{errors.contraseña?.message}</p>
                        </div>
                        <div>
                            <input
                                className={`${errors.contraseñaConfirmacion ? 'error-input' : 'register-input'}`}
                                placeholder="Confirmación contraseña"
                                type='password'
                                {...register('contraseñaConfirmacion')}
                                aria-invalid={errors.contraseñaConfirmacion ? "true" : "false"}
                            />
                            <p>{errors.contraseñaConfirmacion?.message}</p>
                        </div>
                    </div>


                    <button className="new-button">Registrarse</button>
                </form>
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

export default Register;