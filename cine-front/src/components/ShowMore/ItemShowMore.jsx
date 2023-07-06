import { useState } from "react";
import NuevoFavorito from "../Nuevo-favorito";
import { Link } from "react-router-dom";
import Modal from "react-modal"
import ReactPlayer from "react-player"

function ItemShowMore({ movie }) {
    const [showVideo, setShowVideo] = useState(false);

    const handleCloseVideo = () => {
        setShowVideo(false)
    }



    const customStyles = {
        overlay: { zIndex: 1000 }
    }

    return (
        <div className="item-show-more">
            <div className="item-show-more-first">
                <img src={movie.portada} />
            </div>
            <div className="item-show-more-second">

                <div className="item-show-more-description">
                    <div className="item-show-title">
                        <h4>{movie.titulo}</h4>
                        {localStorage.getItem('id') && <NuevoFavorito
                            id={movie.id}
                        />}

                    </div>

                    <div>
                        <p className="clasificacion">{movie.caracteristicas.clasificacion}</p>
                        <p>{movie.caracteristicas.director}</p>
                        <p>{movie.caracteristicas.duracion} mins</p>
                    </div>

                </div>

                <div className="options-buttons">
                    <button className="movie-button" onClick={() => setShowVideo(true)}><img src="/icons/youtube-3.svg" /></button>
                    {localStorage.getItem('id') &&
                    <Link to={`/reserva/${movie.id}`}>
                     <button className="reserve-ticket-button"><img src="/icons/ticket.svg" /></button>   
                    </Link>}
                    <Link to={`/peliculas/${movie.id}`}>
                        <button className="info-button"><img src="/icons/information.svg" /></button>
                    </Link>

                </div>

            </div>

            <Modal
                style={customStyles}
                className="video-modal"
                isOpen={showVideo}
                onRequestClose={handleCloseVideo}
                shouldCloseOnOverlayClick={false}
            >
                <div className="video-details">
                    <div className="detail-video-part">
                        <img src="/icons/close.svg" onClick={handleCloseVideo} />
                    </div>
                    <ReactPlayer
                        width='100%'
                        height='100%'
                        url={movie.trailer}
                    />
                </div>
            </Modal>
        </div>
    )
}

export default ItemShowMore;