import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Modal from "react-modal";

Modal.setAppElement('#root')

function MultipleImageDrop({galerry,setGallery}) {

  const [fileList, setFileList] = useState([]);
  const [imagePreview,setImagePreview] = useState('')
  const [showModal, setShowModal] = useState(false)

  const customStyles = {
    overlay: { zIndex: 20000 }
}

  const fileExtension = (extension) => {
    if (extension == 'jpg') {
      return '/icons/jpg-extension.svg'
    } else if (extension == 'png') {
      return '/icons/png-extension.svg'
    } else {
      return '/icons/file-extension.svg'
    }
  }

  const handleModal = () => {
    
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const handleFileDrop = (acceptedFiles) => {
    const files = acceptedFiles.map((file) => ({
      name: file.name,
      preview: URL.createObjectURL(file),
      extension: fileExtension(file.name.split('.').pop()),
      file: file,
    }));

    setGallery((prevFileList) => [...prevFileList,...files])
    setFileList((prevFileList) => [...prevFileList, ...files]);
  };


  const removeFile = (index) => {
    setFileList((prevFileList) => {
      const updatedFileList = [...prevFileList];
      updatedFileList.splice(index, 1);
      return updatedFileList;
    });
  };

  const removeAll = () => {
    setFileList([])
  }



  const FileDropzone = () => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: handleFileDrop,
      accept: {
        'image/*': ['.jpeg', '.jpg', '.png'],
      },
    });

    return (
      <div className="dropzone" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="dropzone-info">
            <img src="/icons/drag-drop.svg" />
            <p>Suelta las imagenes aquí...</p>
          </div>
        ) : (
          <div className="dropzone-info">
            <img src="/icons/cloud.svg" />
            <p>Arrastra y suelta imagenes aquí, o haz clic para seleccionar imagenes.</p>
          </div>
        )}
      </div>
    );
  };

  const FilePreview = () => {
    return (
      Array.isArray(fileList) && fileList.length > 0 ? (fileList.map((file, index) => (
        <div className="extension-container" key={index}>
          <h4>{file.name}</h4>
          <img src={file.extension} alt="Extension" />
          <div className="extension-buttons" >
            <button className="show-button" onClick={()=>{
              setImagePreview(file.preview)
              handleModal()
            }}><img src='/icons/show.svg' /></button>
            <button className="delete-button" onClick={removeFile}><img src="/icons/delete.svg" /></button>
          </div>
        </div>
      ))) : (
        <div className="empty-files">
          <img src="/icons/empty.svg" />
          <h3>No hay archivos</h3>

        </div>)
    );
  }

  return (
    <div className="dropzone-container">
      <FileDropzone />
      <div className="extensions-preview">
        <FilePreview />
      </div>
      {Array.isArray(fileList) && fileList.length > 1 && (<button onClick={removeAll}>ELIMINAR TODOS</button>)}
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
            <div className="modal-image-preview">
              <img className="modal-object" src={imagePreview} />
            </div>

          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MultipleImageDrop;