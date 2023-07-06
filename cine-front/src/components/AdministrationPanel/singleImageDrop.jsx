import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Modal from "react-modal";

Modal.setAppElement('#root')

function SingleImageDrop({ image, setImage }) {
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [imageExtension, setImageExtension] = useState('')
    const [showModal, setShowModal] = useState(false)

    const customStyles = {
        overlay: { zIndex: 20000 }
    }

    const handleModal = () => {
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
    }

    const handleImageDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file.name.split('.').pop() == 'jpg') {
            setImageExtension('/icons/jpg-extension.svg')
        } else if (file.name.split('.').pop() == 'png') {
            setImageExtension('/icons/png-extension.svg')
        } else {
            setImageExtension('/icons/file-extension.svg')
        }
        const reader = new FileReader();

        reader.onload = () => {
            setImageFile(file)
            setImage(file);
            setImagePreview(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview('');
        setImageExtension('')
        setImage(null)
    };

    const ImageDropzone = () => {
        const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop: handleImageDrop,
            accept: {
                'image/*': ['.jpeg', '.jpg', '.png'],
            },
            maxFiles: 1,
        });

        return (
            <div className="dropzone" {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <div className="dropzone-info">
                        <img src="/icons/drag-drop.svg" />
                        <p>Suelta las imágenes aquí...</p>
                    </div>
                ) : (
                    <div className="dropzone-info">
                        <img src="/icons/cloud.svg" />
                        <p>Arrastra y suelta imágenes aquí, o haz clic para seleccionar imágenes.</p>
                    </div>
                )}
            </div>
        );
    };

    const ImagePreview = () => {
        return (
            image ? (
                <div className="extension-container">
                    <h4>{image.name}</h4>
                    <img src={imageExtension} alt="Imagen seleccionada" />

                    <div className="extension-buttons" >
                        <button className="show-button" onClick={handleModal}><img src='/icons/show.svg' /></button>
                        <button className="delete-button" onClick={removeImage}><img src="/icons/delete.svg" /></button>
                    </div>
                </div>
            ) : (
                <div className="empty-files">
                    <img src="/icons/empty.svg" />
                    <h3>No hay archivos</h3>
                </div>
            )
        )
    }


    return (
        <div className="dropzone-container">
            <ImageDropzone />
            <div className="extensions-preview">
                <ImagePreview />
            </div>

            <Modal
                isOpen={showModal}
                onRequestClose={closeModal}
                className='modal'
                style={customStyles}
            >

                <div className="modal-image-conteiner">
                    <div className="modal-image-content">
                        
                            <div className="detail-image-part">
                                <img src="/icons/close.svg" onClick={closeModal} />
                            </div>
                            <img src={imagePreview} />
                        
                    </div>
                </div>
            </Modal>
        </div>


    );
}

export default SingleImageDrop