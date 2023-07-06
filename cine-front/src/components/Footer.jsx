import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faFacebook, faTwitter, faInstagram, faCloudsmith} from '@fortawesome/free-brands-svg-icons'
import ShareModal from './CompartirProducto';
import { useState } from 'react';

const footer = () => {
    const [showModal, setShowModal] = useState(false);
    const openModal = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };


    return (
        <footer>
            <div className="derechosFooter">
                <Link to="../">
                    <img src="../../icons/dhcinema2-logo.png" alt="logoCinemaFooter" />
                </Link>
            </div>
            <div className='information-footer'>
                <ul>
                    <li>2023</li>
                    <li>Derechos reservados</li>
                </ul>
            </div>
            <div className="iconosFooter">
                <a target='_blank' rel="noopener noreferrer" onClick={openModal}>
                <FontAwesomeIcon icon={faCloudsmith} />
                </a>
                <a href="https://m.facebook.com" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="https://www.linkedin.com/login/es" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="https://www.instagram.com/accounts/login/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faInstagram} />
                </a>
            </div>
            <ShareModal
                    showConfirmation={showModal}
                    closeModal={handleCloseModal}
                    shouldClose={true}
            />
        </footer>

    )
}

export default footer
