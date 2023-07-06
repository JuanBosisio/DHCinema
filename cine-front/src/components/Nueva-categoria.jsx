import React, { useState } from 'react'

const NuevaCategoria = () => {
  
  
  const [title, setTitle] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
      // Validar los campos antes de enviar la solicitud
      const validationErrors = {};
      if (title.trim() === "") {
        validationErrors.title = "El título es requerido"
      }
      if (descripcion.trim() === "") {
        validationErrors.descripcion = "La descripción es requerida"
      }
      if (imageUrl.trim() === "") {
        validationErrors.imageUrl = "La URL de la imagen es requerida"
      }
  
      // Verificar si hay errores de validación
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

    // Crear el objeto de datos a enviar al servidor
    const categoryData = {
      titulo: title,
      descripcion: descripcion,
      urlImagen: imageUrl,
    };
  
    // Realizar la petición POST al servidor
    fetch("http://localhost:8080/categorias", {
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
        // Reseteo los campos del formulario
        setTitle("");
        setDescripcion("")
        setImageUrl("")
        setErrors({})
      })
      .catch((error) => {
        console.error(error); // Manejar el error en caso de que ocurra
      });
  };

  return (
      <div className='crearCategoria'>
        <h2>Crear Categoría</h2>
        <form onSubmit={handleSubmit} className='form-crearCategoria'>
          <div>
            <label>Título : </label>
            <input
              className='sign-in-inputs'
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
          </div>
          <div className='mensajeError'>
            {errors.title && <span>{errors.title}</span>}
          </div>
          <div>
            <label>Descripción : </label>
            <input
            className='sign-in-inputs'
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
          <div className='mensajeError'>
            {errors.description && <span>{errors.description}</span>}
          </div>
          <div>
            <label>URL de la Imagen : </label>
            <input
            className='sign-in-inputs'
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <div className='mensajeError'>
            {errors.imageUrl && <span>{errors.imageUrl}</span>}
          </div>
          <button className='new-button' type="submit">Crear Nueva categoria</button>
        </form>
      </div>
    );
}

export default NuevaCategoria









