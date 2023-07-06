import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import Modal from "react-modal"
import { fetchCategorias, newMovie } from "../components/UseFetch";
import MultipleImageDrop from "../components/AdministrationPanel/multipleImageDrop";
import SingleImageDrop from "../components/AdministrationPanel/singleImageDrop";
import { useEffect } from "react";
import { isValid } from "date-fns";
import moment from "moment";

Modal.setAppElement('#root')



function AdministrationPanel() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [selectedCategories, setSelectedCategories] = useState([])
    const [image, setImage] = useState(null)
    const [banner, setBanner] = useState(null)
    const [gallery, setGallery] = useState([])
    const [multipleUrl, setMultipleUrl] = useState([])
    const [errorMessage, setErrorMessage] = useState('')
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [duration, setDuration] = useState('')
    const [clasification, setClasification] = useState('')
    const [director, setDirector] = useState('')
    const [actors, setActors] = useState('')
    const [trailer, setTrailer] = useState('')

    useEffect(() => {

        setShowConfirmation(true)
        setErrorMessage('Cargando categorias...')
        const fetchAllCategories = async () => {
            try {
                const categories = await fetchCategorias()
                if (categories) {
                    const updatedCategorias = categories.map(categoria => ({
                        ...categoria,
                        selected: false
                    }));
                    console.log(categories)
                    setSelectedCategories(updatedCategorias);
                    setIsLoading(false);
                    setErrorMessage('')
                    setShowConfirmation(false)
                    console.log(selectedCategories)
                }

            } catch (error) {
                console.error(error)
                setIsLoading(false);
                setErrorMessage('')
                setShowConfirmation(false)
            }
        };

        fetchAllCategories()
    }, [])

    const customSyles = {
        overlay: { zIndex: 1000 }
    }

    const onChangeTitle = (e) => {
        setTitle(e.target.value)
    }

    const onChangeDescription = (e) => {
        setDescription(e.target.value)
    }




    const closeModal = () => {
        setShowConfirmation(false)
    }

    const uploadCloudinary = async (image) => {
        try {
            console.log(image)
            const formData = new FormData()
            formData.append('file', image)
            formData.append('upload_preset', 'wxfnshym')
            formData.append('api_key', '533874313672784')

            const response = await fetch('https://api.cloudinary.com/v1_1/dmnjesfeg/image/upload', {
                method: 'POST',
                body: formData,
            })

            const result = await response.json();
            if(result.secure_url){
                const imageUrl = result.secure_url;
                console.log(imageUrl)
                return imageUrl;
            }
            


        } catch (error) {
            console.error(error)
            return false
        }
    }

    const uploadMultipleCloudinary = async () => {
        const multiple = await Promise.all(gallery.map(async (image) => {
            try {
                const formData = new FormData()
                formData.append('file', image.file)
                formData.append('upload_preset', 'wxfnshym')
                formData.append('api_key', '533874313672784')

                const response = await fetch('https://api.cloudinary.com/v1_1/dmnjesfeg/image/upload', {
                    method: 'POST',
                    body: formData,
                })

                const result = await response.json();
                

                

                if(result.secure_url){
                    console.log(result.secure_url)
                    setMultipleUrl([...multipleUrl, result.secure_url])
                    return result.secure_url
                }
            } catch (error) {
                console.error(error)
                
            }
        }))

        return multiple;
        
    }

    const fetchNewMovie = async (url, bannerUrl,multiple) => {

        try {
            const data = {
                titulo: title,
                trailer: trailer,
                portada: url,
                banner: bannerUrl,
                descripcion: description,
                caracteristicas: {
                    reparto: actors,
                    duracion: duration,
                    clasificacion: clasification,
                    director: director
                },
                imagenes: multiple.map((url) => ({ imagen: url })),
                categorias: selectedCategories.filter((category) => category.selected == true)
                    .map((category) => ({ titulo: category.titulo,descripcion: category.descripcion, urlImagen: category.urlImagen })),  
            };
            console.log(data)
            const response = await newMovie(data)
            console.log(response)
            if (response == true) {
                setErrorMessage("Se cargó la película correctamente.")
                setTimeout(() => {
                    setTitle('')
                    setDescription('')
                    setSelectedCategories([])
                    setShowConfirmation(false)
                    setImage(null)
                    setBanner(null)
                    setSelectedCategories([])
                    setGallery([])
                    setMultipleUrl([])
                    setTrailer('')
                    setDuration('')
                    setActors('')
                    setClasification('')
                    setDirector('')
                }, 2000)
            } else {
                setErrorMessage("Error al cargar la película.")
                setTimeout(() => {
                    setShowConfirmation(false)
                }, 2000)
            }
        } catch (error) {
            console.log(error)
            setErrorMessage("Error al cargar la película.")
            setTimeout(() => {
                setShowConfirmation(false)
            }, 2000)
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setErrorMessage("Cargando...")
        setShowConfirmation(true)

        if (!title || !selectedCategories.length || !description || !selectedCategories
            || !image || !gallery || !banner || !duration || !clasification
            || !director || !actors || !trailer) {
            setErrorMessage("Todos los campos son requeridos.");
            setTimeout(() => {
                setShowConfirmation(false)
            }, 2000)
            return;
        }




        const imageUpload = await uploadCloudinary(image)
        const bannerUpload = await uploadCloudinary(banner)
        const multipleUpload = await uploadMultipleCloudinary()
       
        
       
            setTimeout(() => {
                if ((imageUpload == "" || null) || (bannerUpload == "" || null)) {
                    setErrorMessage("Error al subir las imágenes.")
                    console.log(imageUpload)
                    console.log(bannerUpload)
                    console.log(multipleUrl)
                    setMultipleUrl([])
                    setTimeout(() => {
                        setShowConfirmation(false)
                    }, 2500)
                    return
                } else {   
                    setTimeout(() => {
                    fetchNewMovie(imageUpload, bannerUpload,multipleUpload)
                },10000)
                }
            }, 5000)
        
     
    }

    const onChangeDuration = (e) => {
        setDuration(e.target.value)
    }
    const onChangeClasification = (e) => {
        setClasification(e.target.value)
    }


    const onChangeActors = (e) => {
        setActors(e.target.value)
    }

    const onChangeDirector = (e) => {
        setDirector(e.target.value)
    }


    const onChangeTrailer = (e) => {
        setTrailer(e.target.value)
    }

    const handleCategoriesChange = (categoriaId) => {

        const updatedCategorias = selectedCategories.map(categoria => {
            if (categoria.id === categoriaId) {
                return {
                    ...categoria,
                    selected: !categoria.selected
                };
            }
            return categoria;
        });

        console.log(updatedCategorias)

        setSelectedCategories(updatedCategorias);
    };



    return (
        <div>
            {!isLoading && (
                <div className="admin-form">
                    <form onSubmit={handleSubmit}>
                        <div className="admin-div">
                            <div className="admin-div-first">
                                <label>Título:</label>
                                <input
                                    className="form-title"
                                    type="text"
                                    placeholder="Título de película"
                                    value={title}
                                    onChange={onChangeTitle}
                                />
                                <label>Géneros:</label>
                                <div className="categories-form">
                                    {selectedCategories.length > 0 && selectedCategories.map((categorie, index) => (
                                        <label key={categorie.id}>
                                            <input 
                                                type="checkbox"
                                                value={categorie.id}
                                                checked={categorie.selected}
                                                onChange={() => handleCategoriesChange(categorie.id)}
                                            />
                                            {categorie.titulo}
                                        </label>
                                    ))}
                                </div>
                                <label>Descripción</label>
                                <input
                                    className="form-description"
                                    type="text"
                                    placeholder="Descripción"
                                    value={description}
                                    onChange={onChangeDescription}
                                />
                                <label>Director</label>
                                <input
                                    className="form-title"
                                    type="text"
                                    placeholder="Director"
                                    value={director}
                                    onChange={onChangeDirector}
                                />
                                <label>Reparto</label>
                                <input
                                    className="form-title"
                                    type="text"
                                    placeholder="Reparto"
                                    value={actors}
                                    onChange={onChangeActors}
                                />
                                <label>Tráiler</label>
                                <input
                                    className="form-title"
                                    type="text"
                                    placeholder="Url del tráiler"
                                    value={trailer}
                                    onChange={onChangeTrailer}
                                />

                               
                            </div>
                            <div className="admin-div-last">
                                
                    
                                <div>
                                    <label>Duración</label>
                                    <input
                                        type="text"
                                        placeholder="Duración"
                                        value={duration}
                                        onChange={onChangeDuration}
                                    />
                                </div>

                                <div>
                                    <label>Clasificación</label>
                                    <input
                                        type="text"
                                        placeholder="Clasificación"
                                        value={clasification}
                                        onChange={onChangeClasification}
                                    />
                                </div>
                                
                                    

                            </div>
                        </div>



                        <label>Portada:</label>
                        <SingleImageDrop
                            image={image}
                            setImage={setImage}
                        />
                        <label>Banner:</label>
                        <SingleImageDrop
                            image={banner}
                            setImage={setBanner}
                        />
                        <label>Galería:</label>
                        <MultipleImageDrop
                            gallery={gallery}
                            setGallery={setGallery}
                        />
                        <button type="submit">Guardar</button>



                    </form>

                    <Modal
                        isOpen={showConfirmation}
                        onRequestClose={closeModal}
                        contentLabel="Confirmacion"
                        className="modal"
                        style={customSyles}
                    >

                        <div className="modal-conteiner">
                            <div className="modal-content">
                                {errorMessage}
                            </div>
                        </div>
                    </Modal>
                </div>
            )
            }

        </div>)
}

export default AdministrationPanel;
