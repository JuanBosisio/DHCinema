import { useEffect, useState } from "react";
import Select from "react-select/dist/declarations/src/Select";
import Accordion from "../Accordion";

function FirstReserve(props) {
    const [firstCinema, setFirstCinema] = useState(null)
    const [othersCinemas, setOthersCinemas] = useState(null)
    const [selectedCinema,setSelectedCinema] = useState(null)


    useEffect(() => {
        if(selectedCinema == null){
            setOthersCinemas(props.cinemas)
        }else{
            setFirstCinema(selectedCinema)
            setOthersCinemas(props.cinemas.filter(cinema => cinema != selectedCinema))
        }
    },[selectedCinema])

    const handleChangeCinema = (e) =>{
        setSelectedCinema(e.target.value)
    }

    return (
        <div className="first-reserve">
            <Select
                isClearable={true}
                isSearchable={true}
                placeholder="Busque o seleccione un cine"
                onChange={handleChangeCinema}
                options={props.cinemas.map(
                    (cinema) => (
                        { value: cinema.cine, label: cinema.cine }
                    )
                )}
            >
            </Select>
            <div>
                {firstCinema ? (
                    <Accordion 
                        title= {firstCinema.title}
                        content= {
                            <div>
                                {firstCinema.dates.map((date) => (
                                    <button>
                                        {date}
                                    </button>
                                ))}
                            </div>
                            
                        }
                    />
                ) : ''}
                <div>
                    {
                        Array.isArray(othersCinemas) && othersCinemas.map((times) => (
                            <div>
                                {times.dates.map((date) => (
                                    <button>
                                        {date}
                                    </button>
                                ))}
                            </div>
                        ))
                    }
                </div>
                
            </div>

        </div>
    );
}

export default FirstReserve;