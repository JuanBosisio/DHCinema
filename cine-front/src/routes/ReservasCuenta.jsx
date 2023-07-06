
import { useState } from "react";
import { useEffect } from "react";
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import moment from "moment/moment";
import * as yup from "yup"
import { fetchUpdateReserve, fetchUserReserves } from "../components/UseFetch";
import ModalGlobal from "../components/GlobalModal";
import { BounceLoader } from "react-spinners";



function ReservaCuenta() {
    const [reserves, setReserves] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [openModal, setOpenModal] = useState(false)
    const [actualReserve, setActualReserve] = useState(null)
    const [active, setActive] = useState(null)
    const [message, setMessage] = useState(null)
    const [asientos, setAsientos] = useState(null)
    const [monto, setMonto] = useState(null)
    const [isUpdating, setIsUpdating] = useState(false)



    useEffect(() => {
        window.scrollTo(0, 0);
        setIsLoading(true)
        moment.locale('es', {
            months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
            monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
            weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
            weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
            weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
        }
        );

        const fetchAllReserves = async () => {
            try {
                const email = localStorage.getItem('email')
                const response = await fetchUserReserves(email)
                if (Array.isArray(response) && response.length > 0) {
                    const updateResponse = response.map(reserve => {
                        const isSelected = false;
                        return { ...reserve, isSelected };
                    })
                    console.log(updateResponse)
                    setReserves(updateResponse)
                    setIsLoading(false)
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchAllReserves()
    }, [])

    const schema = yup.object({
        nombre: yup.string()
            .required('Se requiere un nombre.')
            .matches(/^[a-zA-ZÀ-ÿ\s]/, 'El nombre no puede poseer caracteres especiales o números.'),
        apellido: yup.string()
            .required('Se requiere un apellido.')
            .matches(/^[a-zA-ZÀ-ÿ\s]/, 'El nombre no puede poseer caracteres especiales o números.'),
        dni: yup.number()
            .required('Se requiere un DNI.')
            .min(6, 'El DNI debe ser mayor a 6 caracteres.'),
        email: yup.string()
            .required('Se requiere un email.')
            .matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, 'Se requiere un email válido.'),
        confirmacionEmail: yup.string()
            .required('Se requiere este campo.')
            .matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, 'Se requiere un email válido.')
            .oneOf([yup.ref('email')], 'Los emails no coinciden entre sí.'),
    })

    const { register, formState: { errors }, handleSubmit, setValue } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async data => {
        if (actualReserve != null) {
            setMessage(
                <div className="reserve-modal">
                    <h2>ACTUALIZAR RESERVA</h2>
                    <div className="reserve-modal-account">
                        <h3>DATOS INGRESADOS</h3>
                        <div className="modal-account">
                            <div>
                                <h4>NOMBRE:</h4>
                                <p>{data.nombre}</p>
                            </div>
                            <div>
                                <h4>APELLIDO:</h4>
                                <p>{data.apellido}</p>
                            </div>
                            <div>
                                <h4>DNI:</h4>
                                <p>{data.dni}</p>
                            </div>
                            <div>
                                <h4>EMAIL:</h4>
                                <p>{data.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="reserve-modal-function">
                        <h3>FUNCION</h3>
                        <div className="modal-function-content">
                            <div>
                                <h4>PELICULA:</h4>
                                <p>{actualReserve.peliculaNombre}</p>
                            </div>
                            <div>
                                <h4>CINE:</h4>
                                <p>{actualReserve.cine}</p>
                            </div>
                            <div>
                                <h4>SALA:</h4>
                                <p>{actualReserve.sala}</p>
                            </div>
                            <div>
                                <h4>FECHA:</h4>
                                <p>{moment(actualReserve.fechaProyeccion).format('dddd, D MMMM YYYY')}</p>
                            </div>
                            <div>
                                <h4>HORARIO:</h4>
                                <p>{actualReserve.horaProyeccion}</p>
                            </div>
                        </div>
                    </div>
                    <div className="reserve-modal-confirm">
                        <p>Seguro que quiere realizar los cambios?</p>
                        <div>
                            <button onClick={() => handleYes(data)}>Actualizar</button>
                            <button onClick={() => handleNo()}>Cancelar</button>
                        </div>
                    </div>

                </div>
            )
            setOpenModal(true)
        } else {
            setMessage(
                <div className="reserve-modal">
                    <h2>SELECCIONA UNA RESERVA</h2>
                    <p>Por favor, seleccion una reserva para actualizar</p>
                </div>
            )
            setOpenModal(true)
            setTimeout(() => {
                setOpenModal(false)
                setMessage(null)
            }, 3000)
        }

    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }

    const handleYes = async (data) => {
        setIsUpdating(true)
        setReserves(null)
        setMessage(
            <div className="reserve-modal">
                <h3>ACTUALIZANDO RESERVA</h3>
                <p>Por favor no cierre ni refresque la pagina.</p>
                <BounceLoader
                    color="#36d7b7"
                    speedMultiplier={2}
                    loading />
            </div>
        )
        const updateReserve = () => {
            setIsLoading(true)
            const newData = data;
            delete newData.confirmacionEmail;
            newData.id = actualReserve.id
            newData.butacas = asientos
            newData.monto = monto
            newData.funcion_id = actualReserve.funcion_id
            newData.usuario_id = parseInt(localStorage.getItem('id'))
            console.log(newData)
            const response = fetchUpdateReserve(newData)

            if (response) {
                setReserves([])
                setMessage(
                    <div className="reserve-modal">
                        <h3>RESERVA ACTUALIZADA</h3>
                        <p>Se actualizo su reserva correctamente.</p>
                        <img src="/icons/accept.svg" />
                    </div>
                )
                setIsLoading(true)
                const fetchAllReserves = async () => {
                    try {
                        const email = localStorage.getItem('email')
                        const response = await fetchUserReserves(email)
                        if (Array.isArray(response) && response.length > 0) {

                            const updateResponse = response.map(reserve => {
                                const isSelected = false;
                                return { ...reserve, isSelected };
                            })
                            console.log(updateResponse)

                            if (updateResponse) {
                                window.location.reload()
                                setReserves(updateResponse)
                                setIsLoading(false)
                            }
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
                fetchAllReserves()
                handleInformation(false)
                setActive(null)
                setTimeout(() => {
                    setIsLoading(false)
                    setOpenModal(false)
                }, 2000)
            }
        }
        updateReserve()
    }

    const handleNo = () => {
        setOpenModal(false)
    }

    const handleInformation = (reserve) => {
        if (reserve != false && reserve != null) {
            setActualReserve(reserve)
            setValue('nombre', reserve.nombre)
            setValue('apellido', reserve.apellido)
            setValue('dni', reserve.dni)
            setValue('email', reserve.email)
            setMonto(reserve.monto)
            setAsientos(reserve.butacas)
        } else {
            setActualReserve(null)
            setValue('nombre', null)
            setValue('apellido', null)
            setValue('dni', null)
            setValue('email', null)
            setMonto(reserve.monto)
            setAsientos(reserve.butacas)
        }
    }




    return (
        <div className="reserve-user">
            {!isLoading && Array.isArray(reserves) && reserves.length > 0 && (
                <div className="amount-reserves">
                    {reserves.map(reserve => (
                        <div className="ticket-container">
                            <div className="reserve-ticket">
                                <div className="title-ticket">
                                    <p>PELÍCULA</p>
                                    <h4>{reserve.peliculaNombre.toUpperCase()}</h4>
                                </div>
                                <img src={reserve.banner} />
                                <div className="date-ticket">
                                    <h5>FECHA INGRESO</h5>
                                    <p>{moment(reserve.fechaProyeccion).format('D MMMM')} - {reserve.horaProyeccion}</p>

                                </div>
                                <div className="ticket-description">
                                    <div>
                                        <h5>SALA</h5>
                                        <p>{reserve.sala}</p>
                                    </div>
                                    <div>
                                        <h5>MODALIDAD</h5>
                                        <p>{reserve.modalidad}</p>
                                    </div>
                                    <div>
                                        <h5>IDIOMA</h5>
                                        <p>{reserve.opcionesIdioma}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="last-ticket">
                                <button className={active == reserve.id ? "last-ticket-selected" : "last-ticket-button"} onClick={() => {
                                    if (active == reserve.id) {
                                        handleInformation(false)
                                        setActive(null)
                                    } else {
                                        handleInformation(reserve)
                                        setActive(reserve.id)
                                    }
                                }}>ACTUALIZAR</button>
                            </div>
                        </div>
                    ))}


                </div>
            )}
            {active != null && <div className="update-reserve">
                <h3>Información de reserva</h3>
                <p className="reserve-user-information">Debe completar con la infomación de la persona encargada de retirar la reserva. En caso de necesitar cambiar la persona permitida para retirar una vez efectuada la reserva, puede actualizarlo desde la sección de su perfil.</p>
                <form onSubmit={handleSubmit(onSubmit)} id="reserve-form">
                    <div className="general-input-section">
                        <div className="general-input-box">
                            <label>NOMBRE *</label>
                            <div className="general-input-container">
                                <img src="/icons/user-form.svg" />
                                <input

                                    placeholder="Ingresa un nombre"
                                    type='text'
                                    className={` ${errors.nombre ? 'general-error-input' : 'general-input'}`}
                                    {...register('nombre')}
                                    aria-invalid={errors.nombre ? "true" : "false"}
                                />
                            </div>
                            <p>{errors.nombre?.message}</p>
                        </div>
                        <div className="general-input-box">
                            <label>APELLIDO *</label>
                            <div className="general-input-container">
                                <img src="/icons/user-form.svg" />
                                <input

                                    className={`${errors.apellido ? 'general-error-input' : 'general-input'}`}
                                    placeholder="Ingresa un apellido"
                                    type='text'
                                    {...register('apellido')}
                                    aria-invalid={errors.apellido ? "true" : "false"}
                                />

                            </div>
                            <p>{errors.apellido?.message}</p>
                        </div>
                        <div className="general-input-box">
                            <label>DNI *</label>
                            <div className="general-input-container">
                                <img src="/icons/dni-form.svg" />
                                <input

                                    className={`${errors.dni ? 'general-error-input' : 'general-input'}`}
                                    placeholder="Ingresa un DNI"
                                    type='number'
                                    {...register('dni')}
                                    aria-invalid={errors.dni ? "true" : "false"}
                                />

                            </div>
                            <p>{errors.dni?.message}</p>
                        </div>

                    </div>
                    <div className="general-input-section">
                        <div className="general-input-box">
                            <label>E-MAIL *</label>
                            <div className="general-input-container">
                                <img src="/icons/email-form.svg" />
                                <input

                                    className={`${errors.email ? 'general-error-input' : 'general-input'}`}
                                    placeholder="Ingresa un e-mail"
                                    type='email'
                                    {...register('email')}
                                    aria-invalid={errors.email ? "true" : "false"}
                                />
                            </div>
                            <p>{errors.email?.message}</p>
                        </div>
                        <div className="general-input-box">
                            <label>CONFIRMACIÓN E-MAIL *</label>
                            <div className="general-input-container">
                                <img src="/icons/email-form.svg" />
                                <input
                                    className={`${errors.confirmacionEmail ? 'general-error-input' : 'general-input'}`}
                                    placeholder="Confirmación e-mail"
                                    type='email'
                                    {...register('confirmacionEmail')}
                                    aria-invalid={errors.confirmacionEmail ? "true" : "false"}
                                />
                            </div>
                            <p>{errors.confirmacionEmail?.message}</p>
                        </div>
                        <div className="general-input-box general-input-box-disable">
                            <label>ASIENTOS</label>
                            <div className="general-input-container ">
                                <img src="/icons/free-seat.svg" />
                                <input
                                    value={asientos}
                                    type="text"
                                    disabled
                                    className="general-input general-input-disable"
                                />
                            </div>
                            <p></p>
                        </div>
                        <div className="general-input-box general-input-box-disable">
                            <label>MONTO</label>
                            <div className="general-input-container">
                                <img src="/icons/user-form.svg" />
                                <input
                                    value={monto}
                                    type="text"
                                    disabled
                                    className="general-input general-input-disable"
                                />
                            </div>
                            <p></p>
                        </div>
                    </div>
                    <button>ENVIAR</button>
                </form>
            </div>}


            <ModalGlobal
                showConfirmation={openModal}
                closeModal={handleCloseModal}
                shouldClose={false}
                message={
                    <div className="account-reserve-modal">
                        {message}
                    </div>
                }
            />
        </div>
    );
}

export default ReservaCuenta;