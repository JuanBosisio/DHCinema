import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react"
import { fetchAllCinemas, fetchAllPolicys, fetchCinemaForTitle, fetchRanking, fetchReserve, fetchSearchFunction, fetchUserList, postRanking, searchMovieDetails, searchRandomMovies } from "../components/UseFetch"
import { useParams, useNavigate, Link } from "react-router-dom"
import Modal from "react-modal"
import ReactPlayer from "react-player"
import Item from "../components/Item"
import BloquePoliticas from "../components/BloquePoliticas.jsx"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClapperboard } from '@fortawesome/free-solid-svg-icons';
import { GoogleMap, InfoWindow, MarkerF } from "@react-google-maps/api"
import Accordion from "../components/Accordion"
import { Stack, Rating, LinearProgress, Slide } from '@mui/material';
import DatePicker, { registerLocale } from 'react-datepicker';
import moment from "moment/moment"
import ModalGlobal from "../components/GlobalModal";
import es from "date-fns/locale/es"
import ActorsCard from "../components/MovieDetails/ActorsCard";
import { array } from "yup";
import NuevoFavorito from "../components/Nuevo-favorito";
registerLocale('es', es)

Modal.setAppElement('#root')

function MovieDetails() {

    const navigate = useNavigate()
    const [movie, setMovie] = useState(null)
    const [movies, setMovies] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const params = useParams()
    const [showVideo, setShowVideo] = useState(false);
    const [video, setVideo] = useState('')
    const [banner, setBanner] = useState({})
    const [first, setFirst] = useState([{}])
    const [last, setLast] = useState([{}])
    const [caracteristica, setCaracteristica] = useState([{}])
    const [showGallery, setShowGallery] = useState(false)
    const [imageId, setImageId] = useState(0)
    const [location, setLocation] = useState(null)
    const [selectedMarker, setSelectedMarker] = useState(null)
    const [cinema, setCinema] = useState(null)
    const [titulo, setTitulo] = useState(null)
    const [searchFunctions, setSearchFunctions] = useState([])
    const [selectedDate, setSelectedDate] = useState(null)
    const [datosObjeto, setDatosObjeto] = useState([])
    const [allCinemas, setAllCinemas] = useState([])
    const [selectedTime, setSelectedTime] = useState(null)
    const [showReserve, setShowReserve] = useState(false)
    const [reserveContent, setReserveContent] = useState('')
    const [functionReserve, setFunctionReserve] = useState(null)
    const [contentAwait, setContentAwait] = useState(false)
    const [allRanking, setAllRanking] = useState([])
    const [allUsers, setAllUsers] = useState([])
    const [descriptionRank, setDescriptionRank] = useState('')
    const [pointsRank, setPointsRank] = useState(0)
    const [informationOption, setInformationOption] = useState(1)
    const [showReseña, setShowReseña] = useState(false)
    const [cinemas, setCinemas] = useState([])
    const [allFunctions, setAllFunctions] = useState([])
    const [allCinemasNames, setAllCinemasNames] = useState([])
    const [selectedButton, setSelectedButton] = useState(null)
    const [allDatosObject, setAllDatosObject] = useState([])
    const [allActivesAccordions, setAllActivesAccordions] = useState([])
    const [activeOthers, setActiveOthers] = useState(false)
    const [isActive, setIsActive] = useState(true)
    const [newIndex, setNewIndex] = useState(null)
    const [policy,setPolicy] = useState([])
    const [newCinema,setNewCinema] = useState(null);
    const customStyles = {
        overlay: { zIndex: 1000 }
    }


    const fetchMovieCine = async (title, cinema) => {
        if (cinema) {
            const search = await fetchCinemaForTitle(title)
            if (search) {
                setAllCinemas(search)

                const names = search.map(cine => cine.nombre);
                const filterN = names.filter(name => name !== cinema)
                console.log(filterN)
                setAllCinemasNames(filterN);
                const searchFuncPromises = filterN.map(async name => {
                    const fetchFunc = await fetchSearchFunction(name, title);
                    if (fetchFunc) {
                        return fetchFunc;
                    }
                });
                console.log(search)
                const actives = filterN.map(name => { return false })
                setAllActivesAccordions(actives)
                Promise.all(searchFuncPromises).then(functions => {
                    const filteredFunctions = functions.filter(func => func !== undefined);
                    setAllFunctions(filteredFunctions);
                    console.log(filteredFunctions);
                });
            }
        } else {
            const search = await fetchCinemaForTitle(title)
            if (search) {

                const names = search.map(cine => cine.nombre);
                
                setAllCinemas(search)
                setAllCinemasNames(names);
                const searchFuncPromises = names.map(async name => {
                    const fetchFunc = await fetchSearchFunction(name, title);
                    if (fetchFunc) {
                        return fetchFunc;
                    }
                });
                const actives = names.map(name => { return false })
                setAllActivesAccordions(actives)
                Promise.all(searchFuncPromises).then(functions => {
                    const filteredFunctions = functions.filter(func => func !== undefined);
                    setAllFunctions(filteredFunctions);
                    console.log(filteredFunctions);
                });
            }


        }
    }

    const handleCloseReseña = () => {
        setShowReseña(false)
    }


    const handleSubmit = async () => {
        setShowReseña(false)
        setShowReserve(true)
        setContentAwait(true)
        setReserveContent(
            <div>
                <h3>Cargando...</h3>
            </div>
        )
        if (pointsRank == 0 || descriptionRank == null) {

            setReserveContent(
                <div>
                    <h3>Debe completar todos los campos.</h3>
                    <img src='/icons/denied.svg' />
                </div>)
            setTimeout(() => {
                setReserveContent('')
                setContentAwait(false)
                setShowReserve(false)
                setShowReseña(true)
                return;
            }, 3000)
        } else {

            const data = {
                usuario_id: parseInt(localStorage.getItem('id')),
                pelicula_id: movie.id,
                puntaje: pointsRank,
                valoracion: descriptionRank
            }
            try {
                const rank = await postRanking(data)
                if (rank) {
                    setReserveContent(
                        <div>
                            <h3>Se registro su valoracion</h3>
                            <img src='/icons/accept.svg' />
                        </div>)
                    setTimeout(() => {
                        setReserveContent('')
                        setContentAwait(false)
                        setShowReserve(false)
                        window.location.reload()
                    }, 3000)
                } else {
                    setReserveContent(
                        <div>
                            <h5>Hubo un error con la reserva</h5>
                            <img src='/icons/denied.svg' />
                        </div>
                    )
                    setTimeout(() => {
                        setReserveContent('')
                        setContentAwait(false)
                        setShowReserve(false)
                    }, 3000)
                }
            } catch (error) {
                setReserveContent(
                    <div>
                        <h5>Hubo un error con la reserva</h5>
                        <img src='/icons/denied.svg' />
                    </div>
                )
                setTimeout(() => {
                    setReserveContent('')
                    setContentAwait(false)
                    setShowReserve(false)
                }, 3000)
            }
        }
    }


    useEffect(() => {
        if (searchFunctions && selectedDate && isActive) {
            const date = moment(selectedDate, 'DD/MM/YYYY')
            const formattedDate = date.format('YYYY-MM-DD')
            const newArray = searchFunctions.filter(func => func.fechaProyeccion == formattedDate)
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
        } else if (!searchFunctions || !selectedDate) {
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

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchMovieId = async () => {

            setIsLoading(true);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log(latitude)
                        setLocation({ lat: latitude, lng: longitude });
                    },
                    (error) => {
                        console.log(error);
                    }
                )
            } else {
                setLocation({ lat: 0, lng: 0 })
            }

            try {
                const url = window.location.href;
                const url2 = new URL(url);
                const searchParams = new URLSearchParams(url2.search);

                const cinemaS = searchParams.get('cinema');
                const tituloS = searchParams.get('titulo');
                if (cinemaS != null && tituloS != null) {
                    const search = await fetchSearchFunction(cinemaS, tituloS)
                    if (search) {
                        setCinema(cinemaS);
                        setTitulo(tituloS);
                        setSearchFunctions(search)
                        console.log(search)
                    }
                }

                const fetchUsers = await fetchUserList()
                if (fetchUserList) {
                    setAllUsers(fetchUsers)
                }

                const policys = await fetchAllPolicys()
                const movieForId = await searchMovieDetails(params.id)
                const movieRandom = await searchRandomMovies()

                if(policys){
                    setPolicy(policys)
                }

                if (movieForId != false) {
                    if (cinemaS) {
                        await fetchMovieCine(movieForId.titulo, cinemaS)
                    } else {
                        await fetchMovieCine(movieForId.titulo, null)
                    }

                    console.log(movieForId)
                    setMovie(movieForId);
                    const fetchRank = await fetchRanking(params.id)
                    if (fetchRank) {
                        setAllRanking(fetchRank)
                        console.log(fetchRank)
                    }
                    setBanner({
                        backgroundImage: `url(${movieForId.banner})`
                    })
                    setVideo(movieForId.trailer)
                    setFirst(movieForId.imagenes.slice(0, 1))
                    setLast(movieForId.imagenes.slice(1, 5))
                    setIsLoading(false);
                }
                if (movieRandom != false) {
                    setMovies(movieRandom)
                }
                if (movieForId != false) {
                    setCaracteristica(movieForId.caracteristicas);
                }



            } catch (error) {
                console.error(error)
            }
        };
        fetchMovieId()

    }, [params.id])

    const handleCloseVideo = () => {
        setShowVideo(false)
    }

    const handleShowVideo = () => {

        setShowVideo(true)
    }

    const handleShowGallery = () => {
        setImageId(0)
        setShowGallery(!showGallery)
    }

    const handleReserva = () => {
        if (localStorage.getItem('id') == null) {
            setShowReserve(true)
            
            setReserveContent(
                <div>
                    <h3>Debe ser un usuario registrado para poder reservar una película.</h3>
                    <p>Será redirigido a la pantalla de inicio de sesión.</p>
                    <img src='/icons/denied.svg' />
                </div>
            )
            setTimeout(() => {
                setReserveContent('')
                
                setShowReserve(false)
                navigate('/inicio-sesion')
            }, 3000)
        } else {
            setShowReserve(true)
            setReserveContent(
                <div>
                    <h5>Usted sera redirigido a la sección de reserva</h5>
                </div>)
            setTimeout(() => {
                setReserveContent('')
                
                setShowReserve(false)
                const url = `/peliculas/reserva/${movie.id}?cine=${newCinema}&funcion=${functionReserve.id}&titulo=${titulo}`
                navigate(url)
            }, 3000)
        }

    }

  
    const handleReservaNo = () => {
        handleCloseReserve()
    }

    const handleCloseReserve = () => {
        setShowReserve(!showReserve)
    }

    const handleActive = (index, active) => {

        setIsActive(active)
        if (active == true) {
            setSelectedButton(null)
            setSelectedDate(null)
            setSelectedTime(null)
            setFunctionReserve(null)
            const newActives = allActivesAccordions.map((data) => {
                return false
            })
            setAllActivesAccordions(newActives)
        }
        console.log(isActive)
    }

    const handleAllActives = (index, active) => {
        const newActives = allActivesAccordions.map((data, indexS) => {
            if (indexS == index)
                return active
            else return false
        })
        setIsActive(false)
        setSelectedButton(null)
        setSelectedDate(null)
        setSelectedTime(null)
        setFunctionReserve(null)
        setAllActivesAccordions(newActives)
        setNewIndex(index)
    }

    const handleActiveOthers = (index, active) => {
        setActiveOthers(active)
    }

    return (
        <div className='movie-details'>
            <div>
                <div className="movie-details-first-content">
                    <div className="banner-video" style={!isLoading ? banner : {}}>
                        <div className="banner-details">
                            <img className="play-icon" src="/icons/play_icon.svg" onClick={handleShowVideo} />
                            <div className="movie-first-info">
                                {!isLoading &&
                                    <div className="movie-first-info-details">
                                        <img src={movie.portada} />
                                        <div className="no-mostrar">
                                            <h4>GÉNEROS </h4>

                                            {movie.categorias.map(categorias => (
                                                <p key={categorias.id}>{categorias.titulo}</p>
                                            ))}

                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="movie-details-title">
                                {!isLoading && <h1>{movie.titulo.toUpperCase()}</h1>}
                                {!isLoading && localStorage.getItem('id') &&
                                    <NuevoFavorito
                                        id={movie.id} />}

                            </div>

                        </div>

                    </div>
                    <div className="movie-details-second">
                        <div className="movie-second-info">
                            {!isLoading && (
                                <div className="movie-details-description">

                                    <div>
                                        <h2 className="details-titles">DETALLES</h2>
                                        <p>{movie.descripcion}</p>
                                    </div>

                                    <div>
                                        <h2 className="details-titles">RESERVA</h2>
                                        <div className="accordion-reserva">

                                            {cinema != null && <Accordion
                                                title={cinema.toUpperCase()}
                                                active={isActive}
                                                onChange={handleActive}
                                                content={
                                                    <div>
                                                        <div className="reserve-datepicker">
                                                            {Array.isArray(searchFunctions) && searchFunctions.length > 0 &&
                                                                (<DatePicker
                                                                    showIcon
                                                                    selected={selectedDate}
                                                                    onChange={date => setSelectedDate(date)}
                                                                    filterDate={date => {
                                                                        const formattedDate = date.toISOString().slice(0, 10)
                                                                        return searchFunctions.some(func => func.fechaProyeccion == formattedDate)
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
                                            />}
                                            <Accordion
                                                title="OTROS CINES"
                                                active={activeOthers}
                                                onChange={handleActiveOthers}
                                                content={
                                                    allCinemasNames.map((cinema, index) =>
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
                                                                                                        setNewCinema(null)
                                                                                                    } else {
                                                                                                        setSelectedTime(obj.horaProyeccion)
                                                                                                        setFunctionReserve(obj)
                                                                                                        setSelectedButton(obj.id)
                                                                                                        setNewCinema(cinema)
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
                                                        />)
                                                }
                                            />
                                            <button className="reserva-button" disabled={!selectedDate || !selectedTime} onClick={handleReserva}>Reserva</button>
                                        </div>
                                    </div>

                                </div>
                            )}
                            <div className="movie-details-related">
                                <h2 className="details-titles">GALERÍA</h2>
                                {!isLoading && (
                                    <div className="image-details">
                                        <div className="grid-container bloque_img">

                                            <div className="half-left">
                                                <img src={first[0].imagen} alt="Movie" />
                                            </div>
                                            <div className="half-right">
                                                {last.map((mov, index) => (
                                                    <div key={mov.id}>
                                                        {index == last.length - 1 ? (
                                                            <figure>
                                                                <div>
                                                                    <p onClick={handleShowGallery}>{`+ ${movie.imagenes.length - 6}`}</p>
                                                                </div>
                                                                <img src={mov.imagen} alt="Movie Gallery" />
                                                            </figure>
                                                        ) :
                                                            (
                                                                <img src={mov.imagen} alt="Movie" />
                                                            )}

                                                    </div>
                                                ))}

                                            </div>

                                        </div>
                                    </div>


                                )}

                            </div>
                        </div>
                    </div>
                </div>

                <div className="movie-details-features">
                    <div>
                        <div>
                            <h2 className="details-titles">INFORMACIÓN GENERAL</h2>
                            <div className="movie-details-features-options">
                                <h3 className={informationOption == 1 ? 'h3-selected' : ''}
                                    onClick={() => setInformationOption(1)}>Información</h3>
                                <h3 className={informationOption == 2 ? 'h3-selected' : ''}
                                    onClick={() => setInformationOption(2)}>Reparto</h3>
                                <h3 className={informationOption == 3 ? 'h3-selected' : ''}
                                    onClick={() => setInformationOption(3)}>Películas similares</h3>
                            </div>
                            <hr></hr>
                        </div>
                        <div className="caracteristicas-container">
                            {movie && movie.caracteristicas && informationOption == 1 && (
                                <div className="caracteristica-item">
                                    <span> <FontAwesomeIcon icon={faClapperboard} /> Clasificación: {movie.caracteristicas.clasificacion}</span>
                                    <span> <FontAwesomeIcon icon={faClapperboard} /> Director: {movie.caracteristicas.director}</span>
                                    <span> <FontAwesomeIcon icon={faClapperboard} /> Duración: {movie.caracteristicas.duracion} minutos</span>
                                    <span> <FontAwesomeIcon icon={faClapperboard} /> Tipo de pantalla: {movie.caracteristicas.modalidad}</span>
                                </div>
                            )}
                            {!isLoading && movie && informationOption == 2 && (<div className="details-reparto">
                                {
                                    movie.caracteristicas.reparto.split(',').map((reparto, index) => (
                                        <ActorsCard
                                            key={index}
                                            nombre={reparto}
                                        />

                                    ))
                                }
                            </div>)}
                            {!isLoading && movie && informationOption == 3 && (

                                <div className="movie-container">
                                    {Array.isArray(movies) && movies.length > 0 ? (
                                        movies.map(movie => (
                                            <Item

                                                key={movie.id}
                                                id={movie.id}
                                                name={movie.titulo}
                                                image={movie.portada}
                                            />
                                        ))
                                    ) : null}
                                </div>

                            )}
                        </div>
                    </div>
                </div>
                <div className="movie-details-map-ranking">
                    <div className="map-container">
                        <h2 className="details-titles">UBICACIONES DE CINES</h2>
                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '80%' }}
                            center={location}
                            zoom={6}
                        >
                            <MarkerF
                                position={location}
                                title="Tu ubicacion actual"
                            >
                            </MarkerF>
                            {Array.isArray(allCinemas) && allCinemas.length > 0 && (
                                allCinemas.map((cinema) => (
                                    <MarkerF
                                        key={cinema.id}
                                        position={{ lat: cinema.latitud, lng: cinema.longitud }}
                                        title={cinema.nombre}
                                        icon={{
                                            url: '/icons/dhcinema2-logo-tiny.png',
                                            scaledSize: new google.maps.Size(40, 40)
                                        }}
                                        onClick={() => setSelectedMarker(cinema)}


                                    />

                                ))
                            )
                            }
                            {
                                selectedMarker && (
                                    <InfoWindow
                                        position={{ lat: selectedMarker.latitud, lng: selectedMarker.longitud }}
                                        onCloseClick={() => setSelectedMarker(null)}
                                    >
                                        <div className="cinema-item-map">
                                            <h3>{selectedMarker.nombre}</h3>
                                            <h5>{selectedMarker.direccion}</h5>
                                            {localStorage.getItem('role') == 'ADMIN' && (
                                                <h5>Latitud: {selectedMarker.latitud}, Longitud: {selectedMarker.longitud}</h5>
                                            )}
                                        </div>
                                    </InfoWindow>
                                )
                            }
                        </GoogleMap>
                    </div>

                    <div className="rank-container">
                        <div className="social-section">
                            <h2 className="details-titles">RESEÑAS</h2>
                        </div>
                        <div>

                            <div className="rank-movie-container">
                                <div className="ranking-numbers">
                                    <div className="rank-previsualizacion">
                                        <p>{Array.isArray(allRanking) && allRanking.length > 0 ? (
                                            allRanking.reduce((prev, rank) => prev + rank.puntaje, 0) / allRanking.length
                                        ) : (0)}</p>
                                        <Stack spacing={1}>
                                            <Rating
                                                name="size-large"
                                                size="large"
                                                value={Array.isArray(allRanking) && allRanking.length > 0 ? (
                                                    allRanking.reduce((prev, rank) => prev + rank.puntaje, 0) / allRanking.length
                                                ) : (0)}
                                                readOnly
                                            />
                                        </Stack>
                                        <p>Basado en {allRanking.length} reseñas.</p>
                                    </div>
                                    <div>
                                        <div className="calculate-ranks">
                                            <Rating
                                                value={5}
                                                readOnly
                                            />

                                            <div
                                                className="percentage-bar"
                                            >
                                                <div
                                                    style={
                                                        {
                                                            height: '100%',
                                                            width: `${Array.isArray(allRanking) && allRanking.length > 0 ? (
                                                                (allRanking.filter(rank => rank.puntaje == 5).length * 100) / allRanking.length
                                                            ) : (0)}%`,
                                                            backgroundColor: 'green',
                                                            borderRadius: 40,
                                                            textAlign: 'right'
                                                        }
                                                    }
                                                >
                                                </div>
                                            </div>
                                        </div>
                                        <div className="calculate-ranks">
                                            <Rating
                                                value={4}
                                                readOnly
                                            />
                                            <div
                                                className="percentage-bar"
                                            >
                                                <div
                                                    style={
                                                        {
                                                            height: '100%',
                                                            width: `${Array.isArray(allRanking) && allRanking.length > 0 ? (
                                                                (allRanking.filter(rank => rank.puntaje == 4).length * 100) / allRanking.length
                                                            ) : (0)}%`,
                                                            backgroundColor: 'lightgreen',
                                                            borderRadius: 40,
                                                            textAlign: 'right'
                                                        }
                                                    }
                                                >
                                                </div>
                                            </div>
                                        </div>
                                        <div className="calculate-ranks">
                                            <Rating
                                                value={3}
                                                readOnly
                                            />
                                            <div
                                                className="percentage-bar"
                                            >
                                                <div
                                                    style={
                                                        {
                                                            height: '100%',
                                                            width: `${Array.isArray(allRanking) && allRanking.length > 0 ? (
                                                                (allRanking.filter(rank => rank.puntaje == 3).length * 100) / allRanking.length
                                                            ) : (0)}%`,
                                                            backgroundColor: 'yellow',
                                                            borderRadius: 40,
                                                            textAlign: 'right'
                                                        }
                                                    }
                                                >
                                                </div>
                                            </div>
                                        </div>
                                        <div className="calculate-ranks">
                                            <Rating
                                                value={2}
                                                readOnly
                                            />
                                            <div
                                                className="percentage-bar"
                                            >
                                                <div
                                                    style={
                                                        {
                                                            height: '100%',
                                                            width: `${Array.isArray(allRanking) && allRanking.length > 0 ? (
                                                                (allRanking.filter(rank => rank.puntaje == 2).length * 100) / allRanking.length
                                                            ) : (0)}%`,
                                                            backgroundColor: 'orange',
                                                            borderRadius: 40,
                                                            textAlign: 'right'
                                                        }
                                                    }
                                                >
                                                </div>
                                            </div>
                                        </div>
                                        <div className="calculate-ranks">
                                            <Rating
                                                value={1}
                                                readOnly
                                            />
                                            <div
                                                className="percentage-bar"
                                            >
                                                <div
                                                    style={
                                                        {
                                                            height: '100%',
                                                            width: `${Array.isArray(allRanking) && allRanking.length > 0 ? (
                                                                (allRanking.filter(rank => rank.puntaje == 1).length * 100) / allRanking.length
                                                            ) : (0)}%`,
                                                            backgroundColor: 'red',
                                                            borderRadius: 40,
                                                            textAlign: 'right'
                                                        }
                                                    }
                                                >
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            {Array.isArray(allRanking) && allRanking.length > 0 ? (
                                <div className="rank-comment-container">
                                    {
                                        allRanking.map(rank => {
                                            console.log(rank)
                                            console.log(allUsers)
                                            console.log(localStorage.getItem('id'))
                                            const usuario = allUsers.find(user => user.id == rank.usuario_id)
                                            if (usuario) {
                                                return <div className="rank-comment">

                                                    <div className="icon-name-reserva">
                                                        <div className="icon-reserva">
                                                            {usuario.nombre.charAt(0).toUpperCase()}{usuario.apellido.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p>{usuario.nombre} {usuario.apellido}</p>
                                                            <div>
                                                                <Rating
                                                                    value={rank.puntaje}
                                                                    readOnly
                                                                />
                                                                <h4>{rank.puntaje}</h4>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="rank-comment-content">
                                                        <p>{rank.valoracion}</p>
                                                    </div>
                                                </div>;
                                            }
                                        })}

                                </div>

                            ) :
                                <div className="rank-movie-container">
                                    <div className="no-rank">
                                        <h4>Esta película no posee ninguna reseña.</h4>
                                    </div>

                                </div>}
                            <button className="button-review" onClick={() => setShowReseña(true)}>Realizar reseña</button>
                        </div>

                    </div>

                </div>
                <div className="cinema-policy">
                    <h2 className="tituloPoliticas">POLÍTICAS DE LA CADENA</h2>
                    {!isLoading && Array.isArray(policy) && policy.length > 0 ?(
                        <BloquePoliticas 
                            policys={policy[0]}
                        />
                    ) : (
                        <div className="policy-show">
                            <div className="policy-show-container">
                                <p>No se encuentra ninguna política registrada</p>
                            </div>
                        </div>
                    )}
                    <p className="aclaracion">Aclaración: los cines pueden tener sus propias políticas, diferentes de la cadena.</p>
                </div>

            </div>

            {!isLoading && (<Modal
                style={customStyles}
                className="video-modal"
                isOpen={showVideo}
                onRequestClose={handleCloseVideo}
                shouldCloseOnOverlayClick={false}
            >
                <div className="video-details">
                    <div className="detail-video-part">
                        <img src="/icons/close.svg" onClick={handleCloseVideo} />
                    </div>
                    <ReactPlayer
                        width='100%'
                        height='100%'
                        url={!isLoading ? video : {}}
                    />
                </div>
            </Modal>)}

            <ModalGlobal
                showConfirmation={showReseña}
                closeModal={handleCloseReseña}
                shouldClose={true}
                message={
                    localStorage.getItem('id') ?
                        <div>
                            <form className="form-rank">
                                <p>{pointsRank}</p>
                                <Stack spacing={1}>
                                    <Rating
                                        name="size-large"
                                        size="large"
                                        value={pointsRank}
                                        onChange={(e, newValue) => {
                                            setPointsRank(newValue)
                                        }}
                                    />
                                </Stack>
                                <input
                                    className="descripcion-rank"
                                    type="text"
                                    placeholder="Deja tu comentario sobre la pelicula..."
                                    value={descriptionRank}
                                    onChange={e => setDescriptionRank(e.target.value)}
                                />
                                <button className="button-review" onClick={handleSubmit}>Enviar</button>
                            </form>
                        </div> :
                        <div className="reserve-content">
                            <div className="reserve-box">
                                <p>Debes <Link to='/inicio-sesion'>iniciar sesión</Link> o <Link to='/registrarse'>registrarte</Link> para escribir una reseña</p>
                                <button onClick={handleCloseReseña} className="button-review">Cerrar</button>
                            </div>
                        </div>


                }
            />


            {!isLoading && (
                <Modal
                    style={customStyles}
                    className="reserve-modal"
                    isOpen={showReserve}
                    onRequestClose={handleCloseReserve}
                    shouldCloseOnOverlayClick={false}
                >
                    <div className="reserve-content">
                        <div className="reserve-box">
                            <h2>RESERVA</h2>
                            {reserveContent}
                            

                        </div>

                    </div>
                </Modal>)}


            {!isLoading && (
                <Modal
                    style={customStyles}
                    className="show-gallery-modal"
                    isOpen={showGallery}
                    onRequestClose={handleShowGallery}
                    shouldCloseOnOverlayClick={false}
                >

                    <div className="show-gallery-conteiner">
                        <div className="close-gallery">
                            <img src="/icons/close-black.svg" onClick={handleShowGallery} />
                        </div>
                        <div className="gallery-image">
                            <img src={movie.imagenes[imageId].imagen} />
                        </div>
                        <div className="carrousel-gallery">
                            {!isLoading && movie.imagenes.map((image, index) => (
                                <img onClick={() => {
                                    console.log(index)
                                    setImageId(index)

                                }} key={index} src={image.imagen} />
                            ))}
                        </div>
                    </div>
                </Modal>


            )}

        </div>
    )
}

export default MovieDetails;
