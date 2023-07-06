import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ListadoCategoriasSeleccionar = ({ peliculaSeleccionada, categoriasSeleccionadas, handleCategoriasSeleccionadas }) => {
  const [Categorias, setCategorias] = useState([]);
  const url = 'http://localhost:8080/categorias';

  useEffect(() => {
    const settings = {
      method: 'GET'
    };
    fetch(url, settings)
      .then(response => response.json())
      .then(data => {
        const updatedCategorias = data.map(categoria => ({
          ...categoria,
          selected: false
        }));
        setCategorias(updatedCategorias);
      });
  }, []);

  useEffect(() => {
    if (peliculaSeleccionada) {
      setCategorias(prevCategorias => {
        return prevCategorias.map(categoria => {
          const isSelected = peliculaSeleccionada.categorias.some(cat => cat.id === categoria.id);
          return {
            ...categoria,
            selected: isSelected
          };
        });
      });
    }
  }, [peliculaSeleccionada]);

  const handleCheckboxChange = (categoriaId) => {
    const updatedCategorias = Categorias.map(categoria => {
      if (categoria.id === categoriaId) {
        return {
          ...categoria,
          selected: !categoria.selected
        };
      }
      return categoria;
    });

    const categoriasSeleccionadas = updatedCategorias.filter(
      (categoria) => categoria.selected
    );

    setCategorias(updatedCategorias);
    handleCategoriasSeleccionadas(categoriasSeleccionadas);
  };

  return (
    <main>
      
      {/* renderizo las cards */}
      <div className='tabla'>
        <h2>Seleccione categorías</h2>
        <table>
          <thead>
            <tr>
              {/* <th scope="col">Id</th> */}
              <th scope="col">Título</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {Categorias.map(categoria => (
              <tr id={categoria.id} key={categoria.id}>
                {/* <td scope='row'>{categoria.id}</td> */}
                <td scope='row'>{categoria.titulo}</td>
                <td scope='row'>
                  <input
                    type='checkbox'
                    name='categoria'
                    value={categoria.id}
                    checked={categoria.selected}
                    onChange={() => handleCheckboxChange(categoria.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
};

export default ListadoCategoriasSeleccionar;
