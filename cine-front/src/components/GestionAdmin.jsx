// import React from 'react'
import { Tabs, Tab } from '@mui/material';
import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

const GestionAdmin = () => {
  window.scrollTo(0, 0);
  const [value, setValue] = useState('')
  const [panelElement, setPanelElement] = useState("")
  const [description, setDescription] = useState("Seleccione una accion a realizar.")
  const [title, setTitle] = useState("Panel de administrador")
  const navigate = useNavigate()
  useEffect(() => {
    console.log(value)
    if (value == 0) {
      setTitle('Listar Películas')
      setDescription('Aqui podrá encontrar un listado de todas las películas en cartelera. Puede actualizarlas como eliminarlas.')
      navigate("/admin/ListadoPeliculas")
    } else if (value == 1) {
      setTitle('Agregar Nueva Película')
      setDescription('Aqui podrá agregar una nueva película. Por favor proporcione el titulo, descripción, género/s, fechas disponibles, tiempo de reproduccion, imagenes de portada, banner y de galeria')
      navigate("/admin/nueva-pelicula")
    } else if (value == 2) {
      setTitle('Listar Categorías')
      setDescription('Aqui podrá listar todas las categorías que se encuentran disponibles.')
      navigate("/admin/ListadoCategorias")
    } else if (value == 3) {
      setTitle('Crear Categoría')
      setDescription('Aquí podrá crear una nueva categoría para asignarle a películas.')
      navigate("/admin/nueva-categoria")
    } else if (value == 4) {
      setTitle('Asignar Categoría')
      setDescription('Aquí podrá listar todas las películas y asignarle una nueva categoría.')
      navigate("/admin/asignar-categoria")
    } else if (value == 5) {
      setTitle('Asignar Rol')
      setDescription('Aquí podrá listar todas los roles y asignarle un nuevo rol.')
      navigate("/admin/asignar-rol")
    } else if (value == 6) {
      setTitle('Listar Ciudades')
      setDescription('Aquí podrá listar, modificar y eliminar todas las ciudades.')
      navigate("/admin/ListadoCiudades")
    } else if (value == 7) {
      setTitle('Crear Ciudades')
      setDescription('Aquí podrá crear una ciudad.')
      navigate("/admin/nueva-ciudad")
    } else if (value == 8) {
      setTitle('Politicas')
      setDescription('Aquí podrá crear o modificar las politicas.')
      navigate("/admin/politicas")
    }
  }, [value])

  return (
    < >
      <div className='admin-banner'>
        <div className='admin-details'>
          <h1>{title}</h1>
          <h2>{description}</h2>
        </div>
      </div>
      <div className='tabs-admin'>
        <Tabs
          value={value}
          onChange={(e, newValue) => setValue(newValue)}
          scrollButtons="auto"
          variant='scrollable'
          centered
        >
          <Tab label="LISTAR PELÍCULAS" />
          <Tab label="CARGAR PELÍCULA" />
          <Tab label="LISTAR CATEGORÍAS" />
          <Tab label="CREAR CATEGORÍA" />
          <Tab label="ASIGNAR CATEGORÍA" />
          <Tab label="ASIGNAR ROL" />
          <Tab label="LISTAR CIUDADES" />
          <Tab label="CREAR CIUDAD" />
          <Tab label="POLITICAS" />
        </Tabs>
      </div>

      <Outlet />
    </>
  )
}

export default GestionAdmin