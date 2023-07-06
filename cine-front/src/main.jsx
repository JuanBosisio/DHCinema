import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './routes/Home.jsx'
import ShowMore from './routes/ShowMore.jsx'
import MovieDetails from './routes/MovieDetails.jsx'
import AdministrationPanel from './routes/AdministrationPanel.jsx'
import SignIn from './routes/SignIn.jsx'
import Register from './routes/Register.jsx'
import ListadoPeliculas from './components/ListadoPeliculas.jsx'
import GestionAdmin from './components/GestionAdmin.jsx'
import ListadoCategorias from './components/ListadoCategorias.jsx'
import NuevaCategoria from './components/Nueva-categoria.jsx'
import AsignarCategoria from './components/AsignarCategoria.jsx'
import ConfirmAccount from './routes/ConfirmAccount.jsx'
import PerfilDropdown from './routes/PerfilDropDown.jsx'
import AsignarRol from './components/AsignarRol.jsx'
import ListadoCiudades from './components/ListadoCiudades.jsx'
import Nuevaciudad from './components/Nueva-ciudad.jsx'
import DetalleCiudad from './components/DetalleCiudad.jsx'
import Reserva from './routes/Reserva.jsx'
import Favorites from './routes/Favorites.jsx'
import ReservaCuenta from './routes/ReservasCuenta.jsx'
import ListarPoliticas from './components/ListarPoliticas.jsx'
import ReservaCompleta from './routes/ReservaCompleta.jsx'
import ReserveConfirmation from './components/Emails/ReserveConfirmation.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/confirmar-cuenta' element={<ConfirmAccount />} />
      <Route path='/' element={<App />}>

        <Route path='/' element={<Home />} />
        <Route path='prueba' element={<ReserveConfirmation/>} />
        <Route path='favoritos' element={<Favorites/>} />
        <Route path='peliculas/pagina/:id' element={<ShowMore />} />
        <Route path='peliculas/:id' element={<MovieDetails />} />
        <Route path='peliculas/reserva/:id' element={<Reserva />} />
        <Route
          path='/admin' element={<GestionAdmin />}>
          <Route path='/admin/ListadoPeliculas' element={<ListadoPeliculas />} />
          <Route path='/admin/nueva-pelicula' element={<AdministrationPanel />} />
          <Route path='/admin/ListadoCategorias' element={<ListadoCategorias />} />
          <Route path='/admin/nueva-categoria' element={<NuevaCategoria />} />
          <Route path='/admin/asignar-categoria' element={<AsignarCategoria />} />
          <Route path='/admin/asignar-rol' element={<AsignarRol />} />
          <Route path='/admin/ListadoCiudades' element={<ListadoCiudades />} />
          <Route path='/admin/nueva-ciudad' element={<Nuevaciudad />} />
          <Route path='/admin/Ciudades/:id' element={<DetalleCiudad />} />
          <Route path='/admin/politicas' element={<ListarPoliticas />}/>
        </Route>

        <Route path='perfil' element={<PerfilDropdown />} />
        <Route path='/reserva' element={<ReservaCompleta />} />
        <Route path='/reserva/:id' element={<ReservaCompleta />} />
        <Route path='reservas' element={<ReservaCuenta />}/>
        <Route path='inicio-sesion' element={<SignIn />} />
        <Route path='registrarse' element={<Register />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
