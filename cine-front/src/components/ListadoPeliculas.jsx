import React, { useEffect, useState } from 'react'
import { deleteMovie } from './UseFetch'
import { searchMoviesForCategories } from './UseFetch'
import Modal from 'react-modal'
import { useParams, useNavigate } from "react-router-dom"


import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import { Alert, TableCell, TableHead, TableRow, Snackbar } from '@mui/material'
//Genera una nabvar para elegir entre ver la lista de películas y el form de agregar película
//Este código muestra una tabla con todas las películas, y a la derecha un botón para eliminar. 
//También se puede agregar un botón para modificar y un form para hacer la modificación.

Modal.setAppElement('#root')

const ListadoPeliculas = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [open,setOpen] = useState(false)
  const [openWaring,setOpenWarning] = useState(false)
  const [peliculas, setPeliculas] = useState([])

  const params = useParams()
  const navigate = useNavigate();

  const customStyles = {
    overlay: { zIndex: 1000 }
  }

  const apiRef = useGridApiRef();

  const columns = [
    {
      field: 'id', headerName: 'ID', width: 100
    },
    {
      field: 'titulo', headerName: 'Titulo', width: 700
    }
  ]

  const handleClose = () => {
    setOpen(false)
    setOpenWarning(false)
  }

  useEffect(() => {
    const fetchMovie = async () => {

      try {
        const movies = await searchMoviesForCategories("Ninguno");
        if (movies) {
          setPeliculas(movies);
          setIsLoading(false)
          
        }

      } catch (error) {
        console.log(error)
      }
    }

    fetchMovie()
  }, [])

  

  

  const hadnlePrueba = () => {
    
    setIsLoading(true)
    const array = Array.from(apiRef.current.getSelectedRows().values())
    if(array.length > 0){
      const deleteMovies = async () => {
        const movies = peliculas;
        const confirm = array.map(async column => {
          await deleteMovie(column.id)
          return true;
        })
        if (confirm) {
          const newMovies = movies.filter(element => !array.includes(element))
          if (newMovies) {
            setPeliculas(newMovies)
            setIsLoading(false)
            setOpen(true)
            setTimeout(() => {
              handleClose()
            },3000)
          }
          return
  
        }
  
      }
  
      deleteMovies()
    } else {
      setIsLoading(false)
      setOpenWarning(true)
      setTimeout(() => {
        handleClose()
      },3000)
    }
    
  }




  return (
    <div className='listadoPeliculas'>


      {!isLoading && <div className='grid-movies'>
        <div className='grid-movies-container'>

          <TableHead>

            <TableRow>
              <TableCell>
                <p className='title-table'>LISTADO PELICULAS</p>
              </TableCell>
            </TableRow>

          </TableHead>
          <DataGrid

            apiRef={apiRef}
            rows={peliculas}
            columns={columns}
            checkboxSelection
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 8 },
              },
            }}
            pageSizeOptions={[8, 15, 20]}
          >

          </DataGrid>
          
        </div>
        <button className='button-handle' onClick={hadnlePrueba}>ELIMINAR</button>
      </div>}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert className='alert' onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              Peliculas eliminadas
            </Alert>
      </Snackbar>
      <Snackbar open={openWaring} autoHideDuration={6000} onClose={handleClose}>
            <Alert className='alert' onClose={handleClose} severity="error" sx={{ width: '100%' }}>
              Selecciona una pelicula
            </Alert>
      </Snackbar>

    </div>
  )
}

export default ListadoPeliculas