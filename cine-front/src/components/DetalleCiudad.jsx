import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DetalleCiudad = () => {

    const { id } = useParams();
    const [Ciudad, setCiudad] = useState({});
    const [nombre, setNombre] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        const url = `http://localhost:8080/ciudades/${id}`;
        const settings = {
          method: 'GET'
        };
    
        fetch(url, settings)
          .then(response => response.json())
          .then(data => {
            setCiudad(data);
            setNombre(data.nombre);

          });
      }, [id]);    

      const onSubmitForm = (e) => {
        e.preventDefault();
        const url = `http://localhost:8080/ciudades`;
        const settings = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id,
            nombre,
            vigente: true
          })
        };
      
        fetch(url, settings)
          .then(response => response.json())
          .then(data => {
            alert("Ciudad modificada correctamente")
          navigate("/admin/ListadoCiudades")
            
          })
          .catch(error => console.error(error));
      };


  return (
    <div>
      <form onSubmit={onSubmitForm}>
        <label htmlFor="id" key={Ciudad.id}>Id: {Ciudad.id}</label>
        <br />
        <label htmlFor="nombre">Nombre:</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <br />
        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  )
}

export default DetalleCiudad