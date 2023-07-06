import React, { useState, useRef } from "react"
import Billboard from "../components/home/Billboard"
import Recommended from "../components/home/Recommended"
import { useEffect } from "react"
import { searchMoviesForCategories, fetchAllCinemas, searchRandomMovies } from "../components/UseFetch"
import Select from "react-select";
import { Link, useNavigate } from 'react-router-dom'



function Home() {
    const [index, setIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [movies, setMovies] = useState([])
    const [cinemas, setCinemas] = useState([])
    const [movieSelected, setMovieSelected] = useState()
    const [newCinemas, setNewCinemas] = useState([])
    const [newMovies, setNewMovies] = useState([])
    const [cinemaSelected, setCinemaSelected] = useState()
    const [randomMovies, setRandomMovies] = useState([])
    const timeRef = useRef(null)
    const navigate = useNavigate()

    const mod = (n, m) => {
        let result = n % m;
        return result >= 0 ? result : result + m;
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        setIsLoading(true)

        const fetchAllFilter = async () => {
            try {
                const random = await searchRandomMovies()
                const movie = await searchMoviesForCategories('Ninguno')
                const cinema = await fetchAllCinemas();
                if (movie && cinema && random) {
                    console.log(movie)
                    console.log(cinema)
                    setRandomMovies(random)
                    setMovies(movie)
                    setCinemas(cinema)
                    setTimeout(() => {

                        setIsLoading(false)
                    }, 100)

                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchAllFilter()
    }, [])

    useEffect(() => {
        if (movieSelected != null) {
            setNewCinemas([]);
            const movie = movies.find((movieS) => movieS.titulo === movieSelected.value);
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
                        movies.forEach((movie) => {
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
                    movies.forEach((movie) => {
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

    const cards = [
        {
            id: "1",
            name: "SUPER MARIO BROS",
            generos: "Aventura",
            time: "2h 10m",
            image: "https://image.tmdb.org/t/p/original/9n2tJBplPbgR2ca05hS5CKXwP2c.jpg",
        },
        {
            id: "2",
            name: "JOHN WICK 4",
            generos: "Accion",
            time: "2h 10m",
            image: "https://image.tmdb.org/t/p/original/7I6VUdPj6tQECNHdviJkUHD2u89.jpg",
        },
        {
            id: "3",
            name: "SISU",
            generos: "Accion",
            time: "2h 10m",
            image: "https://image.tmdb.org/t/p/original/7wGbeXTCW83nQAOw1sbAhA7oKiS.jpg",
        },
    ];

    useEffect(() => {
        if (timeRef.current != null)
            clearTimeout(timeRef.current);
        const timer = setTimeout(() => {
            setIndex((prevIndex) => mod(prevIndex + 1, cards.length));
        }, 3000);

        timeRef.current = timer;

        return () => clearTimeout(timeRef.current);
    }, [index]);

    const handleClickRight = () => {
        setIndex((prevIndex) => mod(prevIndex + 1, cards.length));
    }

    const handleClickLeft = () => {
        setIndex((prevIndex) => mod(prevIndex - 1, cards.length))
    }

    const handleMouseEnter = () => {
        clearTimeout(timeRef.current);
    };

    const handleMouseLeave = () => {
        if (timeRef.current) {
            clearTimeout(timeRef.current);
            timeRef.current = setTimeout(() => {
                setIndex((prevIndex) => mod(prevIndex + 1, cards.length));
            }, 3000);
        }
    };



    const updateCategorie = (value) => {
        setShowCategorie(value);
    }

    const handleMoviesSwitcher = () => {
        if (Array.isArray(newMovies) && newMovies.length == 0 && cinemaSelected != null) {
            return (
                <Select
                    isClearable={true}
                    isSearchable={true}
                    className="react-select-container"
                    placeholder="Busque o seleccione una película"
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
                    placeholder="Busque o seleccione una película"
                    options={movies.map(
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

    const handleSearch = () => {
        if (movieSelected != null && cinemaSelected != null) {
            const foundMovie = movies.find((movie) => movie.titulo === movieSelected.value);
            const url = `/peliculas/${foundMovie.id}?cinema=${cinemaSelected.value}&titulo=${movieSelected.value}`;
            navigate(url);
        }
    }

    return (

        <div className="home-section">
            <div className="carousel-section">
                <div className="carousel">
                    {!isLoading && Array.isArray(randomMovies) && randomMovies.length > 0 && randomMovies.map((item, i) => {
                        const indexLeft = mod(index - 1, cards.length);
                        const indexRight = mod(index + 1, cards.length);

                        let className = "card";

                        if (i === index) {
                            className = "card card--active";
                        } else if (i === mod(index + 1, cards.length)) {
                            className = "card card--right";
                        } else if (i === mod(index - 1, cards.length)) {
                            className = "card card--left";
                        }

                        return (
                            <div className={className}
                                onClick={() => {
                                    if (className === "card card--right") {
                                        handleClickRight();
                                    } else if (className === "card card--left") {
                                        handleClickLeft();
                                    }
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                key={item.id}>
                                <figure>
                                    <div>
                                        <h4>DESTACADOS</h4>
                                        <h1>{item.titulo}</h1>
                                        <h3>{item.categorias[0].titulo} - {item.caracteristicas.duracion} minutos</h3>
                                        <Link to={`/peliculas/${item.id}`}>
                                            <button>Detalles</button>
                                        </Link>
                                        {localStorage.getItem('id') &&
                                        <Link to={`/reserva/${item.id}`}>
                                            <button>Reserva</button>
                                        </Link> }


                                    </div>
                                    <img
                                        src={item.banner}
                                        alt="Desctacados"
                                    ></img>
                                </figure>
                            </div>

                        );
                    })}
                </div>
            </div>
            <div className="search-reserva">
                <h2>Busca películas en cartelera y en tu cine preferido</h2>
                <form onSubmit={handleSearch} className="search-form">
                    {!isLoading &&
                        handleMoviesSwitcher()
                    }
                    {!isLoading &&
                        handleCinemasSwitcher()
                    }
                    <button type="submit" disabled={!movieSelected || !cinemaSelected}>Buscar</button>
                </form>
            </div>


            <Billboard />
            <Recommended />


        </div>
    )
}

export default Home
