import { useEffect, useRef, useState } from "react";
import { fetchCategorias } from "../components/UseFetch";
import Categorie from "../components/utils/Categorie";
import { searchMoviesForCategories } from "../components/UseFetch";
import { Link, useParams } from "react-router-dom";
import { useParams } from "react-router-dom";

function SearchMovies() {

    const divRef = useRef(null);
    const [showCategorie, setShowCategorie] = useState("No mostrar");
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingMovies, setIsLoadingMovies] = useState(true)
    const [movies, setMovies] = useState([])
    const [index, setIndex] = useState(0)
    const [actualPage, setActualPage] = useState(1)
    const params = useParams()

    useEffect(() => {
        const allCategories = async () => {
            setIsLoading(true)
            try {
                const response = await fetchCategorias()
                console.log(response)
                const rta = response.sort((a, b) => {
                    if (a.titulo < b.titulo) { return -1 }
                    if (a.titulo > b.titulo) { return 1 }
                    return 0;
                })
                console.log(rta)
                if (response) {
                    setIsLoading(false)
                    setCategories(rta)
                }
            } catch (error) {
                console.log(error)
            }
        }
        allCategories()
    }, [])

    useEffect(() => {
        const changeCategorie = async () => {
            setIsLoadingMovies(true)
            try {
                setIndex(0)
                const movieForCategorie = await searchMoviesForCategories(showCategorie)
                if (movieForCategorie) {
                    setActualPage(1)
                    setMovies(movieForCategorie);
                    setIsLoadingMovies(false)
                }


                console.log(movies)
                console.log(Math.ceil(8 / 2))

            } catch (error) {
                console.log(error)
            }
        }

        changeCategorie()
    }, [showCategorie])

    const updateCategorie = (categorieName) => {
        setShowCategorie(categorieName)
    }

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

    const handleInputChange = (e) => {
        const newPage = parseInt(e.target.value, 10);
        if (newPage >= 1 && newPage < pages) {
            setActualPage(newPage)
        }
    }

    const prevPage = () => {
        if (actualPage > 1) {
            setActualPage(actualPage - 1)
            if (index - 2 < 0) {
                setIndex(0)
            } else {
                setIndex(index - 2)
            }

        }
    }

    const nextPage = () => {
        if (actualPage < Math.ceil(movies.length / 2)) {
            setActualPage(actualPage + 1)
            if (index + 2 > movies.length - 1) {
                setIndex(movies.length - 1)
            } else {
                setIndex(index + 2)
            }
        }
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
                        max={Math.floor(movies.length / 2)}
                        value={actualPage}
                        onChange={handleInputChange}
                        className="input-pages"
                    />
                    <p>de</p>
                    <p>{Math.ceil(movies.length / 2)}</p>
                </div>
                <img className='last-button' src="/icons/adelante.svg" onClick={nextPage} />
            </div>
        )
    }


    return (
        <div >
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
            {!isLoadingMovies && (
                <div className="categories-compare">
                    <div className="compare-details">
                        <div className="compare-details-titles">
                            <h5>Sala</h5>
                            <h3>{movies[index].caracteristicas.sala}</h3>
                            <h5>Modalidad</h5>
                            <h3>{movies[index].caracteristicas.modalidad}</h3>
                            <h5>Duración</h5>
                            <h3>{movies[index].caracteristicas.duracion}</h3>
                            <h5>Idioma</h5>
                            <h3>{movies[index].caracteristicas.opcionesIdioma}</h3>
                            <h5>Director</h5>
                            <h3>{movies[index].caracteristicas.director}</h3>
                        </div>
                        <div className="compare-details-figure">
                            <figure>
                                <div>
                                    <p>{movies[index].caracteristicas.clasificacion}</p>
                                    <h2>{movies[index].titulo.toUpperCase()}</h2>
                                    <Link key={movies[index].id} to={`/peliculas/${movies[index].id}`}>
                                        <button>Detalles</button>
                                    </Link>
                                </div>
                                <img
                                    src={movies[index].banner}
                                />
                            </figure>
                        </div>
                    </div>
                    {!(movies.length - 1 < index + 1) &&
                        (<div className="compare-details">
                            <div div className="compare-details-figure second-figure">
                                <figure>
                                    <div>
                                        <p>{movies[index+1].caracteristicas.clasificacion}</p>
                                        <h2>{movies[index+1].titulo.toUpperCase()}</h2>
                                        <Link key={movies[index+1].id} to={`/peliculas/${movies[index+1].id}`}>
                                            <button>Detalles</button>
                                        </Link>
                                    </div>

                                    <img className="imagen-compare"
                                        src={movies[index + 1].banner}
                                    />
                                </figure>
                            </div>

                            <div className="compare-details-titles second-titles">
                                <h5>Sala</h5>
                                <h3>{movies[index + 1].caracteristicas.sala}</h3>
                                <h5>Modalidad</h5>
                                <h3>{movies[index + 1].caracteristicas.modalidad}</h3>
                                <h5>Duración</h5>
                                <h3>{movies[index + 1].caracteristicas.duracion}</h3>
                                <h5>Idioma</h5>
                                <h3>{movies[index + 1].caracteristicas.opcionesIdioma}</h3>
                                <h5>Director</h5>
                                <h3>{movies[index + 1].caracteristicas.director}</h3>
                            </div>

                            

                        </div>)}

                    {amountOfPages()}
                </div>
            )}

        </div>
    )
}

export default SearchMovies;