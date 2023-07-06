import React, { useState } from 'react'

const Nuevaciudad = () => {

    const [nombre, setNombre] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validar los campos antes de enviar la solicitud
        const validationErrors = {};
        if (nombre.trim() === "") {
            validationErrors.title = "El nombre es requerido"
        }

        // Verificar si hay errores de validación
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

    // Crear el objeto de datos a enviar al servidor
        const categoryData = {
            "nombre": nombre,
            "vigente": true
          };

              // Realizar la petición POST al servidor
    fetch("http://localhost:8080/ciudades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      })
        .then((response) => response.json())
        .then((data) => {
          // Manejar la respuesta del servidor
          console.log(data); // dejo lugar para acciones posteriores al agregado de los datos
          alert("Ciudad creada correctamente")
          // Reseteo los campos del formulario
          setNombre("");
          setErrors({})
        })
        .catch((error) => {
          console.error(error); // Manejar el error en caso de que ocurra
        });
    };

        return (
            <div className='crearCiudad'>
            <h2>Crear Nueva Ciudad</h2>
            <form onSubmit={handleSubmit} className='formCrearCiudad'>
              <div className='titulo'>
                <label>Título:</label>
                <input
                  className='sign-in-inputs'
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                {errors.nombre && <span>{errors.nombre}</span>}
              </div>
              <button className='new-button' type="submit">Crear</button>
            </form>
          </div>
        )
    }



export default Nuevaciudad