import { Stepper, Step, StepLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchSearchFunction, searchMovieDetails, fetchReserve, actualizarButaca, fetchToMp } from "../components/UseFetch";
import { useNavigate, useParams } from "react-router-dom";
import BounceLoader from "react-spinners/BounceLoader";
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import moment from "moment/moment";
import Cards from 'react-credit-cards-2'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { set } from "date-fns";
import { Resend } from "resend";
import ReserveConfirmation from "../components/Emails/ReserveConfirmation";
initMercadoPago('APP_USR-44df76c6-cff6-4392-87ba-d4d1810b7974');



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
        .oneOf([yup.ref('email')], 'Los emails no coinciden entre si.'),

})

const Reserva = () => {
    const [activeStep, setActiveStep] = useState(0)
    const [movie, setMovie] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [cinema, setCinema] = useState(null)
    const [funct, setFunct] = useState(null)
    const [titulo, setTitulo] = useState(null)
    const [searchFunctions, setSearchFunctions] = useState(null)
    const [seats, setSeats] = useState(1)
    const [price, setPrice] = useState(0)
    const [message, setMessage] = useState("Cargando la reserva")
    const [saveData, setSaveData] = useState(null)
    const [submessage, setSubmessage] = useState("Espere un momento mientras cargamos su reserva. Por favor no refresque ni cierre la pagina.")
    const [isReserve, setIsReserve] = useState(false)
    const [contentAwait, setContentAwait] = useState(true)
    const [billingSelected, setBillingSelected] = useState(null)
    const [mpSuccess, setMpSuccess] = useState(null)
    const [preferenceId, setPreferenceId] = useState(null)
    const [butacas, setButacas] = useState([])
    const [butacasLibres, setButacasLibres] = useState()
    const [amountSelected, setAmountSelected] = useState(0)

    const [filas, setFilas] = useState([])
    const [card, setCard] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: '',
        focus: '',
    })
    const params = useParams()
    const navigate = useNavigate()


    useEffect(() => {
        window.scrollTo(0, 0);
        moment.locale('es', {
            months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
            monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
            weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
            weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
            weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
        }
        );
        setIsLoading(true)
        const fetchMovieId = async () => {
            try {
                const url = new URL(window.location.href);
                const searchParams = new URLSearchParams(url.search);


                const cinemaS = searchParams.get('cine')
                const functionS = searchParams.get('funcion')
                const tituloS = searchParams.get('titulo')
                const success = searchParams.get('mpSuccess')
                const movieForId = await searchMovieDetails(params.id)
                if (success == null) {
                    if (cinemaS != null && functionS != null && tituloS != null) {
                        const search = await fetchSearchFunction(cinemaS, tituloS)
                        if (search) {
                            setCinema(cinemaS)
                            setTitulo(tituloS)
                            console.log(search)
                            setSearchFunctions(search)
                        }
                    }


                    if (movieForId != false && movieForId) {
                        setMovie(movieForId)
                        const funcion = movieForId.funciones.filter(func => func.id == functionS)
                        setFunct(funcion[0])
                        console.log(movieForId)
                        console.log(funcion[0])
                        const comparedById = (a, b) => {
                            if (a.id < b.id) {
                                return -1;
                            }
                            if (a.id > b.id) {
                                return 1;
                            }
                            return 0;
                        }
                        const array = funcion[0].butacas
                        let totalLibres = 0;
                        const newArray = array.map(butaca => {
                            if (!butaca.ocupado) {
                                totalLibres++
                            }
                            return { ...butaca, isSelected: false }
                        })
                        console.log(totalLibres)
                        setButacasLibres(totalLibres)
                        newArray.sort(comparedById)
                        console.log(newArray)
                        setButacas(newArray)
                        setIsLoading(false)
                    }
                } else if (success == 'success') {
                    const funcSuccess = searchParams.get("idFuncion")
                    const idAsientos = searchParams.get("idAsientos")

                    console.log(searchParams.get("nombre"))
                    console.log(searchParams.get("apellido"))
                    console.log(searchParams.get("email"))
                    console.log(searchParams.get('dni'))
                    console.log(localStorage.getItem('id'))
                    console.log(searchParams.get("idFuncion"))

                    if (movieForId) {
                        setMovie(movieForId);
                        const funcion = movieForId.funciones.filter(func => func.id == functionS)
                        if (funcion) {
                            setFunct(funcion[0])
                            setBillingSelected(2);
                            setActiveStep(3)

                            setTimeout(() => {
                                setIsLoading(false)
                                handleCompleteReservation(2)
                            }, 1000)
                        }


                    }
                } else if (success == 'failure') {
                    setContentAwait(true)
                    setActiveStep(3)
                    setMessage("RESERVA DENEGADA")
                    setSubmessage("Hubo un problema con el pago, por favor intentelo mas tarde.")
                    setTimeout(() => {
                        setMessage('')
                        setSubmessage('')
                        setContentAwait(false)
                        navigate('/')                       
                    }, 3000)
                } else if(success == 'pending') {
                    setContentAwait(true)
                    setActiveStep(3)
                    setMessage("ESPERANDO PAGO")
                    setSubmessage("Esperando la acreditacion del pago.")
                    setTimeout(() => {
                        setMessage('')
                        setSubmessage('')
                        setContentAwait(false)
                        navigate('/')
                    }, 3000)
                }

            }
            catch (error) {
                console.log(error)
            }
        }

        fetchMovieId()

    }, [])

    const clearNumber = (value = "") => {
        return value.replace(/\D+/g, "")
    }

    const formatCVC = (value) => {
        const clearValue = clearNumber(value);
        const maxLength = 4;

        return clearValue.slice(0, maxLength);
    }

    const formatExpirationDate = (value) => {
        const clearValue = clearNumber(value);

        if (clearValue.length >= 3) {
            return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
        }

        return clearValue;
    }

    const formatCreditNumber = (value) => {
        if (!value)
            return

        const clearValue = clearNumber(value)
        const nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
            4,
            8
        )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`;
        return nextValue.trim();
    }


    const { register, formState: { errors }, handleSubmit } = useForm({
        resolver: yupResolver(schema),
    });

    const handleButacaImg = (butaca) => {
        if (!butaca) {
            return
        }
        if (butaca.pago) {
            return "/icons/paid-seat.svg"
        } else if (butaca.ocupado) {
            return "/icons/reserve-seat.svg"
        } else if (butaca.isSelected) {
            return "/icons/selected-seat.svg"
        } else {
            return "/icons/free-seat.svg"
        }
    }

    const handleButacaClick = (newButaca) => {
        if (seats >= amountSelected) {
            if (newButaca.pago || newButaca.ocupado) {
                return;
            } else {
                setFilas((prevFilas) => {
                    const newFilas = prevFilas.map((fila) => {
                        const newFila = fila.map((butaca) => {
                            if (butaca.id === newButaca.id) {
                                const but = { ...butaca };

                                if (!butaca.isSelected) {
                                    if (amountSelected < seats) {
                                        but.isSelected = true;
                                        setAmountSelected((prevAmount) => prevAmount + 1);
                                    }
                                } else {
                                    but.isSelected = false;
                                    setAmountSelected((prevAmount) => prevAmount - 1);
                                }
                                return but;
                            }
                            return butaca;
                        });
                        return newFila;
                    });
                    return newFilas;
                });
            }
        }
    };

    const handleButacaClass = (newButaca) => {
        if (newButaca.ocupado || newButaca.pago) {
            return "butaca-disable"
        } else {
            return "butaca-available"
        }
    }

    useEffect(() => {
        if (seats > 0 && seats < 55 && !isLoading) {
            if (funct.modalidad == '2D') {
                setPrice(500)
            } else if (funct.modalidad == '3D') {
                setPrice(750)
            } else if (funct.modalidad == '4D') {
                setPrice(1000)
            }
        } else if (!isLoading) {
            if (funct.modalidad == '2D') {
                setPrice(500)
            } else if (funct.modalidad == '3D') {
                setPrice(750)
            } else if (funct.modalidad == '4D') {
                setPrice(1000)
            }
        }
    }, [seats, funct])

    const onSubmit = data => {
        setActiveStep(1)

        const newData = data;
        delete newData.confirmacionEmail;
        newData.usuario_id = parseInt(localStorage.getItem('id'));
        newData.funcion_id = funct.id;
        setSaveData(newData)
        console.log(newData)
        const fila = []
        for (let i = 0; i < butacas.length; i += 11) {

            fila.push(butacas.slice(i, i + 11))
        }
        setFilas(fila)
        console.log(fila)
    }

    const handlePaymentScreen = () => {
        setActiveStep(2)
    }

    const handleBillingSelected = (id) => {
        setBillingSelected(id)
    }

    const handleInputChange = (e) => {
        console.log(e.target)

        if (e.target.name === "number") {
            e.target.value = formatCreditNumber(e.target.value)
        } else if (e.target.name === "expiry") {
            e.target.value = formatExpirationDate(e.target.value)
        } else if (e.target.name === "cvc") {
            e.target.value = formatCVC(e.target.value)
        }

        setCard((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleInputFocus = (evt) => {
        setCard((prev) => ({ ...prev, focus: evt.target.name }));
    }

    const handleMpPeticion = () => {
        setBillingSelected(2);
        let junta = '';
        filas.map(fila => (
            fila.map(butaca => {
                if (butaca.isSelected) {
                    if (junta == '') {
                        junta = `${butaca.id}`
                    } else {
                        junta = `${junta},${butaca.id}`
                    }
                }

            })
        ))
        const fetch = async () => {
            const url = `?imagen=${movie.portada}&asientos=${seats}&idAsientos=${junta}&precio=${((price) + ((price * 10.5) / 100) + ((price * 12) / 100))}&id=${movie.id}&titulo=${movie.titulo}&idFuncion=${funct.id}&email=${saveData.email}&dni=${saveData.dni}&nombre=${saveData.nombre}&apellido=${saveData.apellido}`
            try {
                const response = await fetchToMp(url);
                if (response) {
                    console.log(response)
                    setPreferenceId(response)
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetch()
    }

    const handleCompleteReservation = async (billing) => {
        const selectedMovie = await searchMovieDetails(params.id)
        try {
            setContentAwait(true)
            setActiveStep(3)
            setMessage("PROCESANDO PAGO")
            setSubmessage("Por favor, no refresquen ni cierre la pantalla.")

            console.log(billing)
            if (billing == 1 || billing == 3) {
                saveData.monto = ((price * seats) + ((price * seats * 10.5) / 100) + ((price * seats * 12) / 100))
                saveData.butacas = amountSelected;
                const reserva = await fetchReserve(saveData);
                const selected = [];
                filas.map(fila => (
                    fila.map(columna => {
                        if (columna.isSelected) {
                            const col = columna;
                            delete col.isSelected;
                            delete col.idUsuario;
                            if(billing == 1){
                                col.pago = true;
                                col.ocupado = false;
                            } else {
                                col.pago = false;
                                col.ocupado = true;
                            }
                            col.usuario_id = localStorage.getItem("id")
                            col.funcion_id = funct.id;
                            selected.push(col)
                        }
                    })
                ))
                console.log(selected)

                selected.map(async butaca => (
                    await actualizarButaca(butaca)
                ))
                setTimeout(() => {
                    setMessage("REALIZANDO RESERVA")
                    setSubmessage("Espere un momento mientras cargamos su reserva. Por favor no refresque ni cierre la pagina.")
                }, 2000)
                if (reserva) {

                    setTimeout(() => {
                        setTimeout(() => {
                            setContentAwait(false)
                            setMessage("RESERVA COMPLETADA")
                            setSubmessage("Su reserva fue ingresada con exito. Sera rederigido a la pantalla principal.")
                            setTimeout(() => {
                                setMessage('')
                                setSubmessage('')
                                navigate('/')
                            }, 2000)
                        }, 3000)
                    }, 4000)
                } else {
                    setMessage("RESERVA DENEGADA")
                    setSubmessage("Ya hay una reserva activa con su email")
                    setContentAwait(false)

                    setTimeout(() => {
                        setMessage('')
                        setSubmessage('')
                        navigate('/')
                    }, 3000)
                }
            } else if (billing == 2) {
                const url = new URL(window.location.href);
                const searchParams = new URLSearchParams(url.search);
                const funcSuccess = searchParams.get("idFuncion")
                const idAsientos = searchParams.get("idAsientos")
                const array = idAsientos.split(',')
                const monto = searchParams.get('precio')
                
                const asientos = parseInt(searchParams.get("asientos"))
                const montoTotal = Math.round(parseFloat((monto * asientos) + ((monto * asientos * 10.5) / 100) + ((monto * asientos * 12) / 100)))
                const arrayInt = array.map(str => parseInt(str))
                const data = {
                    nombre: searchParams.get("nombre"),
                    apellido: searchParams.get("apellido"),
                    email: searchParams.get("email"),
                    dni: searchParams.get("dni"),
                    butacas: asientos,
                    monto: montoTotal,
                    usuario_id: parseInt(localStorage.getItem('id')),
                    funcion_id: parseInt(searchParams.get("idFuncion"))
                }
                console.log(data)
                const reserva = await fetchReserve(data);
                const movieForId = await searchMovieDetails(params.id)
                if (movieForId) {
                    const funcion = movieForId.funciones.filter(func => func.id == funcSuccess)
                    if (funcion) {
                        const butFilter = funcion[0].butacas.filter(butaca => arrayInt.includes(butaca.id))
                        const butaca = butFilter.map(last => {
                            delete last.idUsuario;
                            last.pago = true;
                            last.usuario_id = parseInt(localStorage.getItem('id'))
                            last.funcion_id = funcion[0].id
                            return last;
                        })
                        console.log(butaca)
                        butaca.map(async butaca => (
                            await actualizarButaca(butaca)
                        ))
                    }
                    setTimeout(() => {
                        setMessage("REALIZANDO RESERVA")
                        setSubmessage("Espere un momento mientras cargamos su reserva. Por favor no refresque ni cierre la pagina.")
                    }, 2000)
                    if (reserva) {
                        setTimeout(() => {
                            setTimeout(() => {
                                setContentAwait(false)
                                setMessage("RESERVA COMPLETADA")
                                setSubmessage("Su reserva fue ingresada con exito. Sera rederigido a la pantalla principal.")
                                setTimeout(() => {
                                    setMessage('')
                                    setSubmessage('')
                                    navigate('/')
                                }, 2000)
                            }, 3000)
                        }, 4000)
                    } else {
                        setMessage("RESERVA DENEGADA")
                        setSubmessage("Ya hay una reserva activa con su email")
                        setContentAwait(false)
                        setTimeout(() => {
                            setMessage('')
                            setSubmessage('')
                            navigate('/')
                        }, 3000)
                    }
                }

            } 
            


        } catch (error) {
            setMessage("RESERVA DENEGADA")
            setSubmessage("Ya hay una reserva activa con su email")
            setContentAwait(false)
            console.error(error)
            setTimeout(() => {
                setMessage('')
                setSubmessage('')
                navigate('/')
            }, 3000)
        }
    }

    return (
        <div>
            {!isLoading && mpSuccess == null && <div className="reserve-conteiner">


                <div className="reserve-stepper">
                    <Stepper activeStep={activeStep} >

                        <Step >
                            <StepLabel>Información</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Butacas</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Pago</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Confirmación</StepLabel>
                        </Step>

                    </Stepper>

                </div>


                {!isLoading && activeStep == 0 && (
                    <div className="reserve-template">
                        <div className="reserve-first-information">
                            <div className="reserve-information">
                                <img src={movie.portada} />
                                <div className="reserve-information-text">
                                    <h4>{movie.titulo}</h4>
                                    <div className="reserve-text-elements">
                                        <div>
                                            <h5>Clasificación</h5>
                                            <p>{movie.caracteristicas.clasificacion}</p>
                                        </div>
                                        <div>
                                            <h5>Tiempo</h5>
                                            <p>{movie.caracteristicas.duracion} minutos</p>
                                        </div>
                                        <div>
                                            <h5>Modalidad</h5>
                                            <p>{funct.modalidad}</p>
                                        </div>
                                        <div>
                                            <h5>Idioma</h5>
                                            <p>{funct.opcionesIdioma}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3>Detalles de usuario</h3>
                                <div>
                                    <div className="general-input-section">
                                        <div className="general-input-box">
                                            <label>NOMBRE</label>
                                            <div className="general-input-container">
                                                <img src="/icons/user-form.svg" />
                                                <input
                                                    value={localStorage.getItem('nombre')}
                                                    type="text"
                                                    disabled
                                                    className="general-input"
                                                />
                                            </div>

                                        </div>
                                        <div className="general-input-box">
                                            <label>APELLIDO</label>
                                            <div className="general-input-container">

                                                <img src="/icons/user-form.svg" />
                                                <input
                                                    value={localStorage.getItem('apellido')}
                                                    type="text"
                                                    disabled
                                                    className="general-input"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="general-input-section">
                                        <div className="general-input-box">

                                            <label>EMAIL</label>
                                            <div className="general-input-container">
                                                <img src="/icons/email-form.svg" />
                                                <input
                                                    value={localStorage.getItem('email')}
                                                    type="email"
                                                    disabled
                                                    className="general-input"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            <div>
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
                                            <label>CONFIRMACION E-MAIL *</label>
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
                                    </div>

                                </form>

                            </div>
                        </div>
                        <div>

                        </div>
                        <div className="reserve-second-information">
                            <h3>Resumen de reserva</h3>
                            <div className="reserve-summary">
                                <div className="date-reserve-summary">
                                    <h5>FECHA INGRESO:</h5>
                                    <p>{moment(funct.fechaProyeccion).format('dddd, D MMMM YYYY')}</p>
                                    <p>a las {funct.horaProyeccion} hs</p>
                                </div>

                                <div className="reserve-summary-cinema">
                                    <div className="seats-amount">
                                        <label>ASIENTOS: *</label>
                                        <input
                                            type="number"
                                            className="general-input"
                                            value={seats}
                                            onChange={(event) => setSeats(event.target.value)}
                                        />
                                        <p>Asientos libres {butacasLibres}</p>
                                        {seats <= 0 && (<p>Debe seleccionar un asiento</p>)}
                                        {seats > butacasLibres && (<p>Los asientos no deben superar 55</p>)}
                                    </div>
                                    <div className="reserve-summary-selection">
                                        <h5>SELECCIONASTE:</h5>
                                        <p>{movie.titulo} en {funct.modalidad} {funct.opcionesIdioma} el {moment(funct.fechaProyeccion).format('dddd, d MMMM YYYY')} a las {funct.horaProyeccion} hs para {seats} personas</p>

                                    </div>
                                </div>

                            </div>
                            <h3>Precio de reserva</h3>
                            <div>
                                <div className="reserve-price">
                                    <div>
                                        <p>Entrada:</p>
                                        <p>{price*seats}$</p>
                                    </div>
                                    <div>
                                        <p>IVA del 10.5%:</p>
                                        <p>{(price * seats * 10.5) / 100}$</p>
                                    </div>
                                    <div>
                                        <p>Impuesto a las ganancias del 12%:</p>
                                        <p>{(price * seats * 12) / 100}$</p>
                                    </div>
                                    <div>
                                        <p>TOTAL DE RESERVA</p>
                                        <p>{(price * seats) + ((price * seats * 10.5) / 100) + ((price * seats * 12) / 100)}$</p>
                                    </div>
                                </div>
                            </div>

                            <button disabled={seats <= 0 || seats > butacasLibres} type="submit" form="reserve-form">Siguiente</button>
                        </div>
                    </div>
                )}

                {activeStep == 1 && (
                    <div className="reserve-template">
                        <div className="cinema-representation">

                            <img src="/icons/pantalla.png" />
                            <div className="distribution-seats">
                                {Array.isArray(filas) && filas.length > 0 && filas.map((fila) => {
                                    return <div className="fila">
                                        {fila.map((butaca) => (
                                            <img
                                                src={handleButacaImg(butaca)}
                                                onClick={() => handleButacaClick(butaca)}
                                                className={handleButacaClass(butaca)}
                                            />
                                        ))}
                                    </div>
                                })}
                            </div>
                            <div className="information-seats">
                                {seats >= amountSelected && <p>SELECCIONES PENDIENTES: {seats - amountSelected}</p>}
                                {seats < amountSelected && <p>SELECCIONES PENDIENTES: 0</p>}
                                <div>
                                    <img src="/icons/free-seat.svg" /> <p>BUTACAS LIBRES</p>
                                </div>
                                <div>
                                    <img src="/icons/selected-seat.svg" /><p> BUTACAS SELECCIONADAS</p>
                                </div>
                                <div>
                                    <img src="/icons/reserve-seat.svg" /><p> BUTACAS RESERVADAS</p>
                                </div>
                                <div>
                                    <img src="/icons/paid-seat.svg" /><p> BUTACAS PAGAS</p>
                                </div>
                            </div>

                        </div>
                        <div className="reserve-second-information">
                            <h3>Resumen de reserva</h3>
                            <div className="reserve-summary">
                                <div className="date-reserve-summary">
                                    <h5>FECHA INGRESO:</h5>
                                    <p>{moment(funct.fechaProyeccion).format('dddd, D MMMM YYYY')}</p>
                                    <p>a las {funct.horaProyeccion} hs</p>
                                </div>

                                <div className="reserve-summary-cinema">
                                    <div className="seats-amount">
                                        <label>ASIENTOS: *</label>
                                        <input
                                            type="number"
                                            className="general-input"
                                            value={seats}
                                            onChange={(event) => {

                                                setSeats(event.target.value)
                                            }}
                                        />
                                        <p>Asientos libres {butacasLibres}</p>
                                        {seats < amountSelected && (<p>No puede poner un valor menor a las butacas ya seleccionadas.</p>)}
                                        {seats <= 0 && (<p>Debe seleccionar un asiento</p>)}
                                        {seats > butacasLibres && (<p>Los asientos no deben superar 55</p>)}
                                    </div>
                                    <div className="reserve-summary-selection">
                                        <h5>SELECCIONASTE:</h5>
                                        <p>{movie.titulo} en {funct.modalidad} {funct.opcionesIdioma} el {moment(funct.fechaProyeccion).format('dddd, d MMMM YYYY')} a las {funct.horaProyeccion} hs para {seats} personas</p>

                                    </div>
                                </div>

                            </div>
                            <h3>Precio de reserva</h3>
                            <div>
                                <div className="reserve-price">
                                    <div>
                                        <p>Entrada:</p>
                                        <p>{price * seats}$</p>
                                    </div>
                                    <div>
                                        <p>IVA del 10.5%:</p>
                                        <p>{(price * seats * 10.5) / 100}$</p>
                                    </div>
                                    <div>
                                        <p>Impuesto a las ganancias del 12%:</p>
                                        <p>{(price * seats * 12) / 100}$</p>
                                    </div>
                                    <div>
                                        <p>TOTAL DE RESERVA</p>
                                        <p>{(price * seats) + ((price * seats * 10.5) / 100) + ((price * seats * 12) / 100)}$</p>
                                    </div>
                                </div>
                            </div>

                            <button disabled={seats <= 0 || seats > butacasLibres || seats < amountSelected} onClick={() => handlePaymentScreen()}>Completar Reserva</button>
                        </div>
                    </div>
                )}

                {!isLoading && activeStep == 2 && (
                    <div className="reserve-template">
                        <div className="reserve-first-information">
                            <div className="payment-method">
                                <button onClick={() => handleBillingSelected(1)}><img src="/icons/credit-card.svg" />TARJETA DE CREDITO / DEBITO</button>
                                <button onClick={() => handleMpPeticion()}>MERCADO PAGO</button>
                                <button onClick={() => handleBillingSelected(3)}>RETIRO EN CINE</button>
                            </div>
                            <div className="payment-selected">
                                {billingSelected == 1 && (
                                    <div className="credit-card-section">
                                        <Cards
                                            number={card.number}
                                            expiry={card.expiry}
                                            cvc={card.cvc}
                                            name={card.name}
                                            focused={card.focus}
                                        />
                                        <form>

                                            <div className="general-input-box">

                                                <label>NUMERO DE TARJETA *</label>
                                                <div className="general-input-container">
                                                    <img src="/icons/user-form.svg" />
                                                    <input
                                                        type="tel"
                                                        placeholder="**** **** **** ****"
                                                        className={` ${errors.nombre ? 'general-error-input' : 'general-input'}`}
                                                        name="number"
                                                        value={card.number}
                                                        required
                                                        pattern="[\d| ]{16,22}"
                                                        onChange={handleInputChange}
                                                        onFocus={handleInputFocus}
                                                    />
                                                </div>
                                                <p></p>
                                            </div>
                                            <div className="general-input-box">

                                                <label>NOMBRE DE TARJETA *</label>
                                                <div className="general-input-container">
                                                    <img src="/icons/user-form.svg" />
                                                    <input
                                                        type="text"
                                                        placeholder="Nombre de tarjeta"
                                                        className={` ${errors.nombre ? 'general-error-input' : 'general-input'}`}
                                                        name="name"
                                                        value={card.name}
                                                        required
                                                        onChange={handleInputChange}
                                                        onFocus={handleInputFocus}
                                                    />
                                                </div>
                                                <p></p>
                                            </div>
                                            <div className="credit-card-last">


                                                <div className="general-input-box">

                                                    <label>FECHA DE VENCIMIENTO *</label>
                                                    <div className="general-input-container">
                                                        <img src="/icons/user-form.svg" />
                                                        <input
                                                            type="tel"
                                                            placeholder="**/**"
                                                            className={` ${errors.nombre ? 'general-error-input' : 'general-input'}`}
                                                            name="expiry"
                                                            value={card.expiry}
                                                            pattern="\d\d/\d\d"
                                                            required
                                                            onChange={handleInputChange}
                                                            onFocus={handleInputFocus}
                                                        />
                                                    </div>
                                                    <p></p>
                                                </div>
                                                <div className="general-input-box">

                                                    <label>CODIGO DE SEGURIDAD *</label>
                                                    <div className="general-input-container">
                                                        <img src="/icons/user-form.svg" />
                                                        <input
                                                            type="tel"
                                                            placeholder="****"
                                                            className={` ${errors.nombre ? 'general-error-input' : 'general-input'}`}
                                                            name="cvc"
                                                            value={card.cvc}
                                                            pattern="\d{3,4}"
                                                            required
                                                            onChange={handleInputChange}
                                                            onFocus={handleInputFocus}
                                                        />
                                                    </div>
                                                    <p></p>
                                                </div>
                                            </div>

                                        </form>
                                        <button onClick={() => handleCompleteReservation(1)}>REALIZAR PAGO</button>

                                    </div>


                                )}
                                {billingSelected == 2 && (
                                    <div>
                                        <div id="wallet_container">
                                            {!isLoading && preferenceId != null &&
                                                <Wallet initialization={{ preferenceId: preferenceId }} />
                                            }
                                        </div>
                                    </div>
                                )}
                                {billingSelected == 3 && (
                                    <div>
                                        <button onClick={() => handleCompleteReservation(3)}>COMPLETAR RESERVA</button>
                                    </div>
                                )}
                            </div>

                        </div>
                        <div>
                        </div>
                    </div>
                )}

                {!isLoading && activeStep == 3 && (
                    <div className="complete-reserve">
                        <h3>{message}</h3>
                        <p>{submessage}</p>
                        <div className="complete-reserve-img">
                            {contentAwait ? (<BounceLoader
                                color="#36d7b7"
                                speedMultiplier={2}
                                loading
                            />) : (message.includes("COMPLETADA") ? (<img src="/icons/accept.svg" />) : (<img src="/icons/denied.svg" />))}
                        </div>
                    </div>
                )}


            </div>}
        </div>
    );

}

export default Reserva;