function Categorie(props) {
    
    return(
        <div className="categorie-card">
            <figure onClick={() => props.updateFather(props.name)}>
                <h4>{props.name.toUpperCase()}</h4>
                <img  src={props.image}/>
            </figure>
        </div>
    )
}

export default Categorie