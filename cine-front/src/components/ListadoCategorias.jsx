import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ListadoCategorias = () => {

  const [errorMessage, setErrorMessage] = useState('')
  const [Categorias, setCategorias] = useState([])
  const url = 'http://localhost:8080/categorias';

  useEffect(() => {
    const settings = {
      method: 'GET'
    }
    fetch(url, settings)
      .then(response => response.json())
      .then(data => setCategorias(data))
  }, [])


  const handleBorrarCategoria = (id) => {
    if (!confirm("Confirma eliminar esta categoría?")) return
    const settings = {
      method: 'DELETE'
    };
    fetch(url + "/" + id, settings)
      .then(response => {
        if (response.ok) {

          const fila = document.querySelector(`tr[id="${id}"]`);
          fila.remove();
          alert("categoría borrada correctamente")
          return response.text();
        } else {
          throw new Error(response.text());
        }
      })
      .then(data => console.log((data)))
      .catch(error => console.log((error.message)))

  };

  return (
    <main >
      {/* renderizo las cards */}
      <div className='tabla' >
        <table>
          <thead>
            <tr>
              <th scope="col" className='th#'>#</th>
              <th scope="col" className='thTitulo'>Título</th>
              <th scope="col" className='thDescripcion'>Descripción</th>
              <th scope="col" className='thImagen'>Imagen</th>
            </tr>
          </thead>
          <tbody>
            {Categorias.map((categoria) => (
              <React.Fragment key={categoria.id}>
                <tr id={categoria.id}>
                  <th scope='row'>{categoria.id}</th>
                  <td scope='row' className='tdTitulo'>{categoria.titulo}</td>
                  <td scope='row' className='tdDescripcion'>{categoria.descripcion}</td>
                  <td scope='row' className='tdUrlImagen'>{categoria.urlImagen}</td>
                  {/* 
                Esta línea permite a futuro modificar una película
                <td scope='row'><button ><Link key={dentista.id} to={"/Odontologos/" + dentista.id}>✍</Link> </button></td> 
                */}


                <td scope='row'><button onClick={() => handleBorrarCategoria(categoria.id)}><FontAwesomeIcon icon={faTimes} /></button></td> 
                </tr>
                <tr>
                  <td colSpan='4'><hr /></td>
                </tr>
              </React.Fragment>
            ))}



          </tbody>
        </table>
      </div>
    </main>
  )
}

export default ListadoCategorias