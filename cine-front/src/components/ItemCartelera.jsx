import { Link } from "react-router-dom"

function ItemCartelera(props){

    return (
        <div className="movie-card-cartelera">
            <figure>
                <div className="opt-card">
                    <p>{props.name}</p>
                    <Link key={props.id} to={`../peliculas/${props.id}`}>
                        <button id="details-button">Detalles</button>
                    </Link>
                </div>
                <img className="opt-image" src={props.image}/>
            </figure>
            <ul className="ocultoEnMovil">
                <li>{props.name}</li>
                <li>Clasificación: {props.clasificacion}</li>
                <li>Director: {props.director}</li>
                <li>Duración: {props.duracion} min</li>
            </ul>
        </div>
    )
}

export default ItemCartelera