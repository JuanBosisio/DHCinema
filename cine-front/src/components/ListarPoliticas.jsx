import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from "react"
import { savePolicys, updatePolicys, fetchAllPolicys } from "./UseFetch"
import ModalGlobal from "./GlobalModal"
import { BounceLoader } from "react-spinners";

const schema = yup.object({
    normasDeLaSala: yup.string()
        .required('Se requiere completar la política de normas de la sala.'),

    saludYSeguridad: yup.string()
        .required('Se requiere completar la política de salud y seguridad.'),

    politicaDeCancelacion: yup.string()
        .required('Se requiere completar la política de cancelación.'),

})

const ListarPoliticas = () => {
    const [policys, setPolicys] = useState([])
    const [isCreated, setIsCreated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const fetchPolicys = async () => {
            try {
                const search = await fetchAllPolicys()
                if (Array.isArray(search) && search.length > 0) {
                    setPolicys(search)
                    setIsCreated(<p>Las políticas se encuentran creadas, escribe los cambios y envíalos para actualizarlas.</p>)
                    setValue('normasDeLaSala',search[0].normasDeLaSala)
                    setValue('saludYSeguridad',search[0].saludYSeguridad)
                    setValue('politicaDeCancelacion',search[0].politicaDeCancelacion)
                    setIsLoading(false)
                } else {
                    setIsCreated(<p>Las políticas no se encuentran creadas, escribe las política y envía los cambios.</p>)
                    setIsLoading(false)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchPolicys()
    }, [])

    const { register, formState: { errors }, handleSubmit,setValue } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true)
        setShowConfirmation(true)
        const fetchPolicys = async () => {
            try {
                const search = await fetchAllPolicys()
                if (Array.isArray(search) && search.length > 0)
                    setPolicys(search)
                    setIsLoading(false)
                
            } catch (error) {
                console.log(error)
            }
        }
        const newData = data;
        if (Array.isArray(policys) && policys.length > 0) {
            setMessage(<div className="reserve-modal">
                <h3>ACTUALIZANDO/CREANDO POLÍTICAS</h3>
                <p>Por favor, no cierre ni refresque la página.</p>
                <BounceLoader
                    color="#36d7b7"
                    speedMultiplier={2}
                    loading />
            </div>)
            newData.id = policys[0].id
            const update = await updatePolicys(newData)
            if (update) {
                setMessage(<div className="reserve-modal">
                    <h3>POLÍTICAS ACTUALIZADAS</h3>
                    <p>Se actualizaron sus políticas correctamente.</p>
                    <img src="/icons/accept.svg" />
                </div>)
                setTimeout(() => {
                    setShowConfirmation(false)
                    fetchPolicys()
                }, 3000)

            }
        } else {
            const save = await savePolicys(newData)
            if (save) {
                setMessage(<div className="reserve-modal">
                    <h3>POLÍTICAS CREADAS</h3>
                    <p>Se crearon sus politicas correctamente.</p>
                    <img src="/icons/accept.svg" />
                </div>)
                setTimeout(() => {
                    setShowConfirmation(false)
                    fetchPolicys()
                }, 3000)
            }
        }


    }

    const handleCloseModal = () => {
        setShowConfirmation(false)
    }

    return (
        <div className="change-policys">

            {!isLoading && <form className="policys-form" onSubmit={handleSubmit(onSubmit)} id="reserve-form">
                <h2>NUESTRAS POLÍTICAS</h2>
                {isCreated}
                <div className="general-input-section">
                    <div className="general-input-box">

                        <label>NORMAS DE LA SALA *</label>
                        <div className="general-input-container">
                            <img src="/icons/user-form.svg" />
                            <textarea
                                placeholder="Ingresa la politica normas de la sala"
                                type='text'
                                className={` ${errors.normasDeLaSala ? 'general-error-input' : 'general-input'}`}
                                {...register('normasDeLaSala')}
                                aria-invalid={errors.normasDeLaSala ? "true" : "false"}
                            />
                        </div>
                        <p>{errors.normasDeLaSala?.message}</p>
                    </div>
                    <div className="general-input-box">
                        <label>SALUD Y SEGURIDAD *</label>
                        <div className="general-input-container">
                            <img src="/icons/user-form.svg" />
                            <textarea
                                className={`${errors.saludYSeguridad ? 'general-error-input' : 'general-input'}`}
                                placeholder="Ingresa la politica de salud y seguridad"
                                type='text'
                                {...register('saludYSeguridad')}
                                aria-invalid={errors.saludYSeguridad ? "true" : "false"}
                            />

                        </div>
                        <p>{errors.saludYSeguridad?.message}</p>
                    </div>
                    <div className="general-input-box">
                        <label>POLÍTICA DE CANCELACIÓN *</label>
                        <div className="general-input-container">
                            <img src="/icons/user-form.svg" />
                            <textarea
                                className={`${errors.politicaDeCancelacion ? 'general-error-input' : 'general-input'}`}
                                placeholder="Ingresa la politica de cancelacion"
                                type='text'
                                {...register('politicaDeCancelacion')}
                                aria-invalid={errors.politicaDeCancelacion ? "true" : "false"}
                            />

                        </div>
                        <p>{errors.politicaDeCancelacion?.message}</p>
                    </div>
                </div>
                <button>ENVIAR</button>
            </form>}

            <ModalGlobal
                showConfirmation={showConfirmation}
                closeModal={handleCloseModal}
                shouldClose={false}
                message={
                    <div className="account-reserve-modal">
                        {message}
                    </div>
                }
            />
        </div>
    )
}

export default ListarPoliticas;