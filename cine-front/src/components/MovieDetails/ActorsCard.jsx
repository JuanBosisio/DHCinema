

function ActorsCard(props){

    return (
        <div className="actor-card">
            <img  src="/icons/actors.svg"/>
            <div>
                <h3>{props.nombre}</h3>
            </div>
        </div>
    )
}

export default ActorsCard