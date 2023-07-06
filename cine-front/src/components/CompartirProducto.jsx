import React, { useState } from 'react';
import Modal from 'react-modal';
import { useLocation } from 'react-router-dom';
import { FacebookShareButton, WhatsappShareButton, TwitterShareButton } from 'react-share';
import { faFacebook, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ShareModal = ({ showConfirmation, shouldClose, closeModal }) => {

    const customStylesII = {
        overlay: { zIndex: 1000 },
    };


    const shareUrl = window.location.href;
    const shareMessage = 'Mira la página de películas que encontré!!';



    return (
        <Modal
            isOpen={showConfirmation}
            className="shareModal"
            style={customStylesII}
            onRequestClose={closeModal}
            shouldCloseOnOverlayClick={shouldClose}
        >
            <div className='shareModalhtml'>
                <div className='closeShare'>
                   
                    <FontAwesomeIcon onClick={closeModal} icon={faTimes} />
                    
                </div>
                <div>
                    <WhatsappShareButton url={shareUrl} title={shareMessage}>
                        <FontAwesomeIcon icon={faWhatsapp} />
                    </WhatsappShareButton>
                    <FacebookShareButton url='http://127.0.0.1:5173/' quote='Mira la página de películas que encontré!!' hashtag='#DHCinema'>
                        <FontAwesomeIcon icon={faFacebook} />
                    </FacebookShareButton>
                    <TwitterShareButton url={shareUrl} title={shareMessage}>
                        <FontAwesomeIcon icon={faTwitter} />
                    </TwitterShareButton>
                </div>
                <div className=''>
                    <h3>Link de la página</h3>
                    <div className='urlLink'>
                        <h3 className='modalCompartirLink'><a>{shareUrl}</a></h3>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ShareModal;