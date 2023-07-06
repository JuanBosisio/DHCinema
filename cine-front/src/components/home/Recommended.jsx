import { searchRandomMovies } from "../UseFetch";
import Item from "../Item";
import { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";

function Recommended() {
    const [movies, setMovies] = useState([])
    const [isLoading, setIsLoading] = useState(true);


    useEffect(()=>{

        
        const fetchMovieRandom = async () => {
            setIsLoading(true);
            try{
                const movieForCategorie = await searchRandomMovies()
                setMovies(movieForCategorie);
                setIsLoading(false);
            } catch (error) {
                console.error(error)
                setIsLoading(false);
                
            }
        };
        
        fetchMovieRandom()
    },[])

    const loadingBox = () => {
      const loaders = []
  
        for (let i=0;i<8;i++){
          loaders.push(
          <div key={i} className="content-loader">
            <ContentLoader
              
              speed={2}
              width="100%"
              height="100%"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
            >
              <rect x="0" y="0" rx="3" ry="3" width="100%" height="100%" />
            </ContentLoader>
          </div>
            
          )
        }
  
        return loaders;
  }

    return (
        <div className="recommended-section">
                <h2>RECOMENDADOS</h2>
                <div className="movie-container">
              {isLoading ? (
                loadingBox()
              ) : (
                Array.isArray(movies) && movies.length > 0 ? (
                  movies.map(movie => (
                      <Item
                        key={movie.id}
                        id={movie.id}
                        name={movie.titulo}
                        image={movie.portada}
                      />
                  ))
                ) : (
                  loadingBox()
                )
              )}
            </div>
        </div>
    )
}

export default Recommended;
