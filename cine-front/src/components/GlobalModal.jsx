import Modal from "react-modal";

const ModalGlobal = ({ showConfirmation,closeModal,message,shouldClose }) => {
    const customStyles = {
        overlay: { zIndex: 1000 }
    }

    return (
        <Modal
            isOpen={showConfirmation}
            onRequestClose={closeModal}
            style={customStyles}
            className = "modal"
            shouldCloseOnOverlayClick= {shouldClose}
        >

            <div>
                {message}
            </div>
        </Modal>
    )

}

export default ModalGlobal;