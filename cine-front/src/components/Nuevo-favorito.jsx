import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { searchFavorite } from "./UseFetch";

const NuevoFavorito = (props) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoritoId, setFavoritoId] = useState(null);
  

  useEffect(() => {
    const fetchFavorito = async () => {
      const pelicula_id = props.id;
      const email = localStorage.getItem("email");

      try {
        const response = await searchFavorite(email)
        if (Array.isArray(response) && response.length>0) {
          
          const data = response.filter((favorite) => favorite.pelicula_id == pelicula_id)
          if(Array.isArray(data) && data.length > 0){
            setFavoritoId(data[0].id)
            setIsFavorited(data[0].favorito)
          }
        } 
      } catch (error) {
        console.error(error); // Handle the error if it occurs
      }
    };

    fetchFavorito();
  }, []);

  const handleFavorite = () => {
    const pelicula_id = props.id;
    const usuario_id = localStorage.getItem("id");

    const categoryData = {
      pelicula_id,
      usuario_id,
    };

    if (favoritoId) {
      axios
        .put(`http://localhost:8080/favoritos/${favoritoId}`, {
          data: categoryData,
        })
        .then((response) => {
          console.log(response.data); // Handle the server response as needed
          setIsFavorited(!isFavorited);
          
        })
        .catch((error) => {
          console.error(error); // Handle the error if it occurs
        });
    }  else {
      axios
        .post("http://localhost:8080/favoritos", categoryData)
        .then((response) => {
          console.log(response.data); // Handle the server response as needed
          setFavoritoId(response.data.id);
          setIsFavorited(true);
          
        })
        .catch((error) => {
          console.error(error); // Handle the error if it occurs
        });
    }
  };

  return (
    <div className="favorite-button">
      {isFavorited ? <img onClick={handleFavorite} src="/icons/new-favorite.svg" /> : <img onClick={handleFavorite} src="/icons/unfavorite.svg" />}
    </div>
  );
};

export default NuevoFavorito;