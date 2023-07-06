import React, { useEffect, useState } from "react";
import ListadoPeliculasRadioButton from "./ListadoPeliculasRadioButton";
import ListadoCategoriasSeleccionar from "./ListadoCategoriasSeleccionar";

const AsignarCategoria = () => {

  useEffect(()=>{window.scrollTo(0, 0)},[])
  

  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState("");
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [guardado, setGuardado] = useState(false);

  const handleSelectPelicula = (pelicula) => {
    setPeliculaSeleccionada(pelicula);
  };

  const handleCategoriasSeleccionadas = (categorias) => {
    setCategoriasSeleccionadas(categorias);
  };


  const guardarCambios = () => {
    const url = "http://localhost:8080/peliculas";

    const stringificar =() => JSON.stringify({
      ...peliculaSeleccionada,
      categorias: categoriasSeleccionadas.map(({selected, ...rest})=>rest)
    })

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: stringificar()
    };
  
    fetch(url, requestOptions)
      .then(response => {
        if (response.ok) {
          alert("Los cambios se han guardado.");
          setGuardado(true);
        } else {
          throw new Error("Error al guardar los cambios.");
        }
      })
      .catch(error => {
        console.error(error);
        alert("Error al guardar los cambios.");
      });
  };

  return (
    <div>
      <div className="asignoCategorias">
      <div><ListadoPeliculasRadioButton handleSelectPelicula={handleSelectPelicula} /></div>
      <div><ListadoCategoriasSeleccionar 
      peliculaSeleccionada={peliculaSeleccionada} 
      categoriasSeleccionadas={categoriasSeleccionadas}
      handleCategoriasSeleccionadas={handleCategoriasSeleccionadas} /></div>
      </div>
      <hr/>
      <button className="botonAsignarCategoria" onClick={guardarCambios}>Guardar cambios</button>
      {guardado && <p>Los cambios se han guardado.</p>}
    </div>
  );
};

export default AsignarCategoria;


