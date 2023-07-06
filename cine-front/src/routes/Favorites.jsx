
import React, { useEffect, useState } from "react";
import { searchMoviesForCategories, searchFavorite, updateFavorite } from "../components/UseFetch";


const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [allMovies, setAllMovies] = useState([])

  useEffect(() => {
    setIsLoading(true)
    const fetchFavorites = async () => {
      try {
        const response = await searchFavorite(localStorage.getItem("email"))
        if (Array.isArray(response) && response.length > 0) {
          setFavorites(response)
        }
      } catch (error) {
        console.error(error); // Handle the error if it occurs
      }

    }

    fetchFavorites()

    const fetchAllMovies = async () => {
      try {
        const response = await searchMoviesForCategories('Ninguno')
        if (response) {
          setAllMovies(response)
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchAllMovies()
  }, [])

  const handleUnfavorite = (id,idFavorite) => {
    setIsLoading(true)
    const pelicula_id = id;
    const usuario_id = localStorage.getItem("id");

    const categoryData = {
      pelicula_id,
      usuario_id,
    };


    const fetchUpdate = async() => {
      try{
        await updateFavorite(idFavorite,categoryData)
      } catch (error) {
        console.error(error)
      }
    }

    fetchUpdate()

    setTimeout(() => {
      const fetchFavorites = async () => {
        try {
          const response = await searchFavorite(localStorage.getItem("email"))
          if (Array.isArray(response) && response.length > 0) {
            setFavorites(response)
          }
        } catch (error) {
          console.error(error); // Handle the error if it occurs
        }
  
      }
  
      fetchFavorites()
  
      const fetchAllMovies = async () => {
        try {
          const response = await searchMoviesForCategories('Ninguno')
          if (response) {
            setAllMovies(response)
            setIsLoading(false)
          }
        } catch (error) {
          console.log(error)
        }
      }
  
      fetchAllMovies()
  }, 300)}

  return (
    <div className="favorites-box">
      <div className="favorites-container">
        <h2>FAVORITOS</h2>
        {!isLoading && favorites.map(favorite => {
          console.log(favorite)
          const data = allMovies.filter(movie => movie.id == favorite.pelicula_id)
          if (Array.isArray(data) && data.length > 0) {
            if (favorite.favorito) {
              return (

                <div className="reserve-information">
                  <img src={data[0].portada} />
                  <div className="favorites-information">

                    <div className="reserve-information-text">
                      <h4>{data[0].titulo}</h4>
                      {favorite.favorito ? <img onClick={() => handleUnfavorite(data[0].id,favorite.id)} src="/icons/new-favorite.svg" /> : <img src="/icons/unfavorite.svg" />}

                    </div>
                    <div className="reserve-text-elements">
                      <div>
                        <h5>Clasificación</h5>
                        <p>{data[0].caracteristicas.clasificacion}</p>
                      </div>
                      <div>
                        <h5>Tiempo</h5>
                        <p>{data[0].caracteristicas.duracion} minutos</p>
                      </div>

                    </div>
                  </div>
                </div>

              )
            }
          }
        })}
      </div>
    </div>

  )
}

export default Favorites