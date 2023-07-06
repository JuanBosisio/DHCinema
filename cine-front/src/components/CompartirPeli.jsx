import Modal from 'react-modal'
import {useLocation} from 'react-router-dom'
import { faWhatsapp, faFacebook, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ShareMovieModal = ({showConfirmation, closeModal, shouldClose}) => {
    const location = useLocation();
    const customStylesIII ={
        overlay: {zIndex : 1000}
    }

    return (
        <Modal
        isOpen={showConfirmation}
        onRequestClose={closeModal}
        className="ShareMovieModal"
        style={customStylesIII}
        shouldCloseOnOverlayClick={shouldClose}
        >
        <div>
            <a href={`https://api.whatsapp.com/send?text=${location.pathname}`} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faWhatsapp} />
            </a>
            <a href={`https://www.facebook.com/sharer.php?u=${location.pathname}`} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href={`https://www.linkedin.com/shareArticle?url=${location.pathname}`} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a href={`https://twitter.com/intent/tweet?text=MIEpresa&url=${location.pathname}`} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} />
            </a>
        </div>
        <hr />
        <div className=''>
            <h3>Link de la película</h3>
            <h3 className='modalCompartirLink'><a href={location.pathname}></a></h3>
        </div>
        </Modal>
    );
    }
    
    export default ShareMovieModal;


