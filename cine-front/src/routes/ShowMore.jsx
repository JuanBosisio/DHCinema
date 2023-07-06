import { useEffect, useState, useRef } from "react";
import { fetchAllCinemas, searchMoviesForCategories, showPages, fetchCategorias, searchCategoriesMovies } from "../components/UseFetch";
import ContentLoader from "react-content-loader";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from "react-select";
import ItemShowMore from "../components/ShowMore/ItemShowMore";
import { useNavigate } from 'react-router-dom'
import Categorie from "../components/utils/Categorie";


function ShowMore() {
    window.scrollTo(0, 0);
    const [showCategorie, setShowCategorie] = useState("Todos");
    const [lastCategorie, setLastCategorie] = useState("Todos")
    const [isLoading, setIsLoading] = useState(true)
    const [movies, setMovies] = useState()
    const [pages, setPages] = useState(1)
    const [actualPage, setActualPage] = useState(1)
    const [moviesSearch, setMoviesSearch] = useState([])
    const [cinemas, setCinemas] = useState([])
    const [movieSelected, setMovieSelected] = useState()
    const [newCinemas, setNewCinemas] = useState([])
    const [newMovies, setNewMovies] = useState([])
    const [cinemaSelected, setCinemaSelected] = useState()
    const [categories, setCategories] = useState([])

    const [isLoadingMovies, setIsLoadingMovies] = useState(true)
    const navigate = useNavigate()
    const divRef = useRef(null);

    const btnpressprev = () => {
        let width = divRef.current.offsetWidth;
        divRef.current.scrollLeft = divRef.current.scrollLeft - width;
        console.log(width)
    }

    const btnpressnext = () => {
        let width = divRef.current.offsetWidth;
        divRef.current.scrollLeft = divRef.current.scrollLeft + width;
        console.log(width)
    }

    useEffect(() => {

        const fetchSearch = async () => {
            try {
                const movie = await searchMoviesForCategories('Ninguno')
                const cinema = await fetchAllCinemas();
                if (movie && cinema) {
                    console.log(movie)
                    console.log(cinema)
                    setMoviesSearch(movie)
                    setCinemas(cinema)
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchSearch()
    }, [])



    useEffect(() => {
        if (showCategorie != lastCategorie) {
            setActualPage(1)
        }
        if (showCategorie == "Todos") {
            if (Array.isArray(categories) && categories.length == 0) {
                const allCategories = async () => {
                    setIsLoading(true)
                    try {
                        const response = await fetchCategorias()
                        console.log(response)

                        if (response) {
                            const newObject = {
                                id: 0,
                                titulo: "Todos",
                                descripcion: "Todas las peliculas",
                                urlImagen: "https://www.themoviedb.org/t/p/original/foGkPxpw9h8zln81j63mix5B7m8.jpg",
                                vigente: true
                            }
                            const rta = response.sort((a, b) => {
                                if (a.titulo < b.titulo) { return -1 }
                                if (a.titulo > b.titulo) { return 1 }
                                return 0;
                            })
                            const newArray = [newObject, ...rta]

                            console.log(rta)
                            setCategories(newArray)

                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
                allCategories()
            }

            const fetchShowMovies = async () => {
                setIsLoading(true);
                try {
                    const moviePages = await showPages(actualPage - 1);
                    if (moviePages) {
                        setMovies(moviePages.content)
                        if (pages != moviePages.totalPages && moviePages.totalPages != null)
                            setPages(moviePages.totalPages)
                        setLastCategorie(showCategorie);
                        setIsLoading(false)
                    }

                } catch (error) {
                    console.error(error)
                }
            }

            fetchShowMovies()
        } else {
            const fetchCategoriesMovie = async () => {
                setIsLoading(true);
                try {
                    const moviePages = await searchCategoriesMovies(actualPage - 1,showCategorie);
                    if(moviePages){
                        setMovies(moviePages.content)
                        if (pages != moviePages.totalPages && moviePages.totalPages != null)
                            setPages(moviePages.totalPages)
                        setLastCategorie(showCategorie);
                        setIsLoading(false)
                    }
                    
                } catch (error) {
                    console.error(error)
                }
            }
            fetchCategoriesMovie()
        }
    }, [actualPage, showCategorie])

    useEffect(() => {
        if (movieSelected != null) {
            setNewCinemas([]);
            const movie = moviesSearch.find((movieS) => movieS.titulo === movieSelected.value);
            cinemas.forEach((cine) => {
                cine.salas.forEach((sala) => {
                    sala.funciones.forEach((funcion) => {
                        movie.funciones.forEach((funcionMovie) => {
                            if (funcionMovie.id === funcion.id) {
                                setNewCinemas((prevCinemas) => [...prevCinemas, cine]);
                            }
                        });
                    });
                });
            });
        } else {
            setNewCinemas([]);
            if (cinemaSelected != null) {
                setNewMovies([]);
                const cinema = cinemas.find((cinemaS) => cinemaS.nombre === cinemaSelected.value);
                cinema.salas.forEach((sala) => {
                    sala.funciones.forEach((funcion) => {
                        moviesSearch.forEach((movie) => {
                            movie.funciones.forEach((funcionMovie) => {
                                if ((funcionMovie.id == funcion.id)) {
                                    setNewMovies((prevMovies) => [...prevMovies, movie]);
                                }
                            });
                        });
                    });
                });
            } else {
                setNewMovies([]);
            }
        }
    }, [movieSelected, cinemaSelected]);

    useEffect(() => {
        if (cinemaSelected != null) {
            setNewMovies([]);
            const cinema = cinemas.find((cinemaS) => cinemaS.nombre === cinemaSelected.value);
            cinema.salas.forEach((sala) => {
                sala.funciones.forEach((funcion) => {
                    moviesSearch.forEach((movie) => {
                        movie.funciones.forEach((funcionMovie) => {
                            if (funcionMovie.id === funcion.id) {
                                setNewMovies((prevMovies) => [...prevMovies, movie]);
                            }
                        });
                    });
                });
            });
        }
    }, [cinemaSelected]);

    const updateCategorie = (categorieName) => {
        setShowCategorie(categorieName)
    }

    const handleSearch = () => {
        if (movieSelected != null && cinemaSelected != null) {
            const foundMovie = movies.find((movie) => movie.titulo === movieSelected.value);
            const url = `/peliculas/${foundMovie.id}?cinema=${cinemaSelected.value}&titulo=${movieSelected.value}`;
            navigate(url);
        }
    }
    const handleMoviesSwitcher = () => {
        if (Array.isArray(newMovies) && newMovies.length == 0 && cinemaSelected != null) {
            return (
                <Select
                    isClearable={true}
                    isSearchable={true}
                    className="react-select-container"
                    placeholder="Busque o seleccione una pelicula"
                    options={[{ value: null, label: "Sin opciones" }]} />
            )
        }
        if (Array.isArray(newMovies) && newMovies.length > 0) {
            return (
                <Select
                    value={movieSelected}
                    onChange={movie => setMovieSelected(movie)}
                    isClearable={true}
                    isSearchable={true}
                    className="react-select-container"
                    placeholder="Busque o seleccione una pelicula"
                    options={newMovies.filter((value, index) => {
                        return newMovies.indexOf(value) === index
                    }).map(
                        (movie) => (
                            { value: movie.titulo, label: movie.titulo }
                        )
                    )}


                ></Select>
            )
        } else if (Array.isArray(movies) && movies.length > 0) {
            return (
                <Select
                    value={movieSelected}
                    onChange={movie => setMovieSelected(movie)}
                    isClearable={true}
                    className="react-select-container"
                    isSearchable={true}
                    placeholder="Busque o seleccione una pelicula"
                    options={moviesSearch.map(
                        (movie) => (
                            { value: movie.titulo, label: movie.titulo }
                        )
                    )}

                ></Select>
            )
        }
    }

    const handleCinemasSwitcher = () => {
        if (Array.isArray(newCinemas) && newCinemas.length > 0) {
            return (
                <Select
                    isClearable={true}
                    className="react-select-container"
                    isSearchable={true}
                    placeholder="Busque o seleccione un cine"
                    value={cinemaSelected}
                    onChange={setCinemaSelected}
                    options={newCinemas.filter((value, index) => {
                        return newCinemas.indexOf(value) === index
                    }).map(
                        (cinema) => (
                            { value: cinema.nombre, label: cinema.nombre }
                        )
                    )}

                ></Select>
            )
        } else if (Array.isArray(cinemas) && cinemas.length > 0) {
            return (
                <Select
                    isClearable={true}
                    isSearchable={true}
                    className="react-select-container"
                    placeholder="Busque o seleccione un cine"
                    value={cinemaSelected}
                    onChange={setCinemaSelected}
                    options={cinemas.map(
                        (cinema) => (
                            { value: cinema.nombre, label: cinema.nombre }
                        )
                    )}

                ></Select>
            )
        }
    }

    const handleInputChange = (e) => {
        const newPage = parseInt(e.target.value, 10);
        if (newPage >= 1 && newPage < pages) {
            setActualPage(newPage)
        }
    }

    const prevPage = () => {
        if (actualPage > 1) {
            setActualPage(actualPage - 1)
        }
    }

    const nextPage = () => {
        if (actualPage < pages) {
            setActualPage(actualPage + 1)
        }
    }

    const loadingBox = () => {
        const loaders = []
        for (let i = 0; i < 10; i++) {
            loaders.push(
                <div key={i} className="content-loader">
                    <ContentLoader
                        speed={2}
                        width="100%"
                        height="100%"
                        backgroundColor="#f3f3f3"
                        foregroundColor="#ecebeb"
                    >
                        <rect x="0" y="0" rx="3" ry="3" width="100%" height="100%" />
                    </ContentLoader>
                </div>
            )
        }
        return loaders;
    }


    const renderElements = () => {
        return (
            <div className="page-div">
                <div className="page-container">
                    {isLoading ? (
                        loadingBox()
                    )
                        : (
                            Array.isArray(movies) && movies.length > 0 ? (
                                movies.map(movie => (
                                    <ItemShowMore
                                        key={movie.id}
                                        movie={movie}
                                    />
                                ))
                            ) : (
                                loadingBox()
                            )
                        )
                    }
                </div>
            </div>
        )
    }



    const amountOfPages = () => {
        return (
            <div className="pages">
                <img className='first-button' src="/icons/atras.svg" onClick={prevPage} />
                <div className="pages-numbers">
                    <input
                        type="number"
                        readOnly
                        min="1"
                        max={pages}
                        value={actualPage}
                        onChange={handleInputChange}
                        className="input-pages"
                    />
                    <p>de</p>
                    <p>{pages}</p>
                </div>
                <img className='first-button' src="/icons/adelante.svg" onClick={nextPage} />
            </div>
        )
    }




    return (
        <div className="show-more">
            {!isLoading && (
                <form onSubmit={handleSearch} className="search-form">
                    {!isLoading &&
                        handleMoviesSwitcher()
                    }
                    {!isLoading &&
                        handleCinemasSwitcher()
                    }
                    <button type="submit" disabled={!movieSelected || !cinemaSelected}>Buscar</button>
                </form>
            )}
            {!isLoading && (
                <div className="categories-section">
                    <img className='first-button' src="/icons/atras.svg" onClick={btnpressprev} />
                    <div className="carrousel-slider" ref={divRef}>
                        {categories.map(categorie => (
                            <Categorie
                                value={showCategorie}
                                updateFather={updateCategorie}
                                key={categorie.id}
                                name={categorie.titulo}
                                image={categorie.urlImagen}
                            />
                        ))}
                    </div>
                    <img className='last-button' src="/icons/adelante.svg" onClick={btnpressnext} />
                </div>

            )}
            {!isLoading &&
                <div className="all-movies">




                    {renderElements()}
                    {amountOfPages()}
                </div>}
        </div>
    );
}

export default ShowMore;
