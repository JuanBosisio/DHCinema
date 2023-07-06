import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAllCinemas, fetchCinemaForTitle, fetchSearchFunction, searchMoviesForCategories } from "../components/UseFetch";
import Accordion from "../components/Accordion";
import DatePicker, { registerLocale } from "react-datepicker";
import moment from "moment";
import es from "date-fns/locale/es";
registerLocale('es', es)

const ReservaCompleta = () => {
    const [movieSelected, setMovieSelected] = useState(null)
    const [allMovies, setAllMovies] = useState([])
    const [allCinemas, setAllCinemas] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingCinema, setIsLoadingCinema] = useState(true)
    const [allCinemasNames, setAllCinemasNames] = useState([])
    const [allActivesAccordions, setAllActivesAccordions] = useState([])
    const [allFunctions, setAllFunctions] = useState([])
    const [activeOthers, setActiveOthers] = useState(true)
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedTime, setSelectedTime] = useState(null)
    const [functionReserve, setFunctionReserve] = useState(null)
    const [newIndex, setNewIndex] = useState(null)
    const [selectedButton, setSelectedButton] = useState(null)
    const [newCinema, setNewCinema] = useState(null)
    const [datosObjeto, setDatosObjeto] = useState(null)
    const [cinemaSelected, setCinemaSelected] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        setIsLoading(true)
        const fetchAll = async () => {
            try {
                const movieSearch = await searchMoviesForCategories('Ninguno');
                const cinemaSearch = await fetchAllCinemas();
                if (movieSearch && cinemaSearch) {
                    setAllMovies(movieSearch)
                    setAllCinemas(cinemaSearch)
                    if (params.id) {
                        setMovieSelected(params.id)
                    }
                    setIsLoading(false)
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchAll()
    }, [])



    useEffect(() => {
        if (movieSelected != null) {
            setNewCinema(null)
            setIsLoadingCinema(true)
            const selected = allMovies.filter(movie => movie.id == movieSelected)
            const fetch = async () => {
                try {
                    const search = await fetchCinemaForTitle(selected[0].titulo)
                    if (search) {
                        setNewCinema(search)
                        const names = search.map(cine => cine.nombre);
                        setAllCinemasNames(names)
                        const searchFuncPromises = names.map(async name => {
                            const fetchFunc = await fetchSearchFunction(name, selected[0].titulo)
                            if (fetchFunc) {
                                return fetchFunc;
                            }
                        })
                        if (searchFuncPromises) {
                            const actives = names.map(name => { return false })
                            setAllActivesAccordions(actives)
                            Promise.all(searchFuncPromises).then(functions => {
                                const filteredFunctions = functions.filter(func => func !== undefined);
                                setAllFunctions(filteredFunctions);
                                console.log(filteredFunctions);

                            });
                            setIsLoadingCinema(false)
                        }
                    }
                } catch (error) {
                    console.error(error)
                }
            }

            if (selected) {
                fetch()
            }
        }

    }, [movieSelected])

    useEffect(() => {
        if (!selectedDate) {
            setDatosObjeto(null)
        } else {
            const date = moment(selectedDate, 'DD/MM/YYYY')
            const formattedDate = date.format('YYYY-MM-DD')
            const newArray = allFunctions[newIndex].filter(func => func.fechaProyeccion == formattedDate)
            const dividedData = newArray.reduce((result, obj) => {
                if (!result[obj.modalidad]) {
                    result[obj.modalidad] = {};
                }

                if (result[obj.modalidad][obj.opcionesIdioma]) {
                    result[obj.modalidad][obj.opcionesIdioma].push(obj);
                } else {
                    result[obj.modalidad][obj.opcionesIdioma] = [obj];
                }

                return result;
            }, {});
            console.log(dividedData);
            setDatosObjeto(dividedData)
        }

    }, [selectedDate])

    const handleReserva = () => {
        const array = allMovies.filter(movie => movie.id == movieSelected)
        const url = `/peliculas/reserva/${movieSelected}?cine=${cinemaSelected}&funcion=${functionReserve.id}&titulo=${array[0].titulo}`
        navigate(url)
    }


    const handleAllActives = (index, active) => {
        const newActives = allActivesAccordions.map((data, indexS) => {
            if (indexS == index)
                return active
            else return false
        })

        console.log(selectedDate)
        setSelectedButton(null)
        setSelectedDate(null)
        setSelectedTime(null)
        setFunctionReserve(null)
        setDatosObjeto(null)
        setAllActivesAccordions(newActives)
        setNewIndex(index)

    }

    const handleActiveOthers = (index, active) => {
        setActiveOthers(active)
    }

    const handleSelected = (id) => {
        setMovieSelected(id)
    }


    return (
        <div className="complete-reserve-2">
            <div className="reserve-movie-container">
                <h3>PASO 1: SELECCIONE UNA PELICULA</h3>
                <p className="reserve-p">Por favor, seleccione una pelicula para visualizar los cines y funciones disponibles.</p>
                <div className="movies-grid">
                    {!isLoading && Array.isArray(allMovies) && allMovies.length > 0 && (
                        allMovies.map((movie) => (
                            <div onClick={() => handleSelected(movie.id)} className={movieSelected == movie.id ? "movie-card movie-selected" : "movie-card"}>
                                <figure>
                                    <div className="opt-card">
                                        <p>{movie.titulo}</p>
                                    </div>
                                    <img className="opt-image" src={movie.portada} />
                                </figure>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className="cinema-selection">
                {!isLoading && (
                    <div className="accordion-reserva">
                        <Accordion
                            title="PASO 2: SELECCIONE UN CINE"
                            active={activeOthers}
                            onChange={handleActiveOthers}
                            content={
                                !isLoadingCinema && Array.isArray(newCinema) && newCinema.length > 0 && movieSelected ? allCinemasNames.map((cinema, index) =>
                                    <Accordion
                                        title={cinema.toUpperCase()}
                                        active={allActivesAccordions[index]}
                                        onChange={handleAllActives}
                                        index={index}
                                        content={
                                            <div>
                                                <div className="reserve-datepicker">
                                                    {Array.isArray(allFunctions) && allFunctions.length > 0 &&
                                                        (<DatePicker
                                                            showIcon
                                                            selected={selectedDate}
                                                            onChange={date => setSelectedDate(date)}
                                                            filterDate={date => {
                                                                const formattedDate = date.toISOString().slice(0, 10)
                                                                return allFunctions[index].some(func => func.fechaProyeccion == formattedDate)
                                                            }}
                                                            className="reserve-input-date"
                                                            isClearable
                                                            locale="es"
                                                            dateFormat={"dd/MM/yyyy"}
                                                            placeholderText="Seleccione una fecha"
                                                        />)}

                                                </div>
                                                {datosObjeto != null && <div className="modalidad-content">
                                                    {datosObjeto != null && (
                                                        Object.keys(datosObjeto).map(modalidad => (
                                                            Object.keys(datosObjeto[modalidad]).map(idioma => (
                                                                <div key={`${modalidad}-${idioma}`}>
                                                                    <div className="modalidad-title"><h3>{modalidad}</h3> <h4>{idioma}</h4></div>
                                                                    <div>
                                                                        {datosObjeto[modalidad][idioma].map(obj => (
                                                                            <button className={selectedButton == obj.id ? 'option-button selected' : 'option-button'} key={obj.id} onClick={() => {
                                                                                if (selectedButton == obj.id) {
                                                                                    setSelectedTime(null)
                                                                                    setFunctionReserve(null)
                                                                                    setSelectedButton(null)
                                                                                   

                                                                                } else {

                                                                                    setSelectedTime(obj.horaProyeccion)
                                                                                    setFunctionReserve(obj)
                                                                                    setSelectedButton(obj.id)
                                                                                    setCinemaSelected(cinema)
                                                                                }

                                                                            }}>{obj.horaProyeccion}</button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ))
                                                    )}
                                                </div>}
                                            </div>
                                        }
                                    />) : (<div>Seleccione una pelicula</div>)

                            }
                        />
                        <button className="reserva-button" onClick={handleReserva} disabled={!selectedDate || !selectedTime}>Reserva</button>
                    </div>
                )}
            </div>

        </div>
    )
}

export default ReservaCompleta;