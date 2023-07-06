import React, { useEffect, useState } from "react";


const ListadoPeliculasRadioButton = ({handleSelectPelicula}) => {
    const [Peliculas, setPeliculas] = useState([]);
    const url = "http://localhost:8080/peliculas";


useEffect(() => {
  const fetchData = async () => {
    const settings = { method: "GET" };
    const response = await fetch(url, settings);
    const data = await response.json();
    setPeliculas(data);
  };
  fetchData();
}, []);


    return (
        <main>
            {/* renderizo las cards */}
            <div className="tabla">
                <h2>Seleccione película</h2>
                <table>
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Título</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Peliculas.map((pelicula) => (
                            <tr id={pelicula.id} key={pelicula.id}>
                                <td scope="row">
                                    <input
                                        type="radio"
                                        name="pelicula"
                                        value={pelicula.id}
                                        onChange={() => handleSelectPelicula(pelicula)}
                                    />
                                </td>
                                {/* <th scope="row">{pelicula.id}</th> */}
                                <td scope="row">{pelicula.titulo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </main>
    );
};

export default ListadoPeliculasRadioButton;
