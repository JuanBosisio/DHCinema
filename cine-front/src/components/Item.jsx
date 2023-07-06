
import { Link } from "react-router-dom";
import NuevoFavorito from "./Nuevo-favorito";

function Item(props) {


  return (
    <div className="movie-card">
      <figure>

        <div className="opt-card">
          <p>{props.name}</p>
          <div className="item-buttons">
            <Link key={props.id} to={`/peliculas/${props.id}`}>
              <img className="information-button"  src="/icons/information.svg" />
            </Link>
            {localStorage.getItem('id') &&
            <Link to={`/reserva/${props.id}`}>
              <img src="/icons/ticket.svg" />
            </Link>}
            {localStorage.getItem("id") && <NuevoFavorito id={props.id} />}
          </div>

        </div>
        <img className="opt-image" src={props.image} alt={props.name} />

      </figure>
    </div>
  );
}

export default Item;
