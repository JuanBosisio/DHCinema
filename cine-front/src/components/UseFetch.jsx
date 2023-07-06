// Clase preparada para recibir una url y hacer peticiones a traves de un parametro

const API_ENDPOINT = `http://localhost:8080`;


export const searchMoviesForCategories = async (url) => {

    if (url === 'Ninguno') {
        url = '/peliculas'
    } else {
        url = `/peliculas/categoria/${url}`
    }

    console.log(`${API_ENDPOINT}${url}`)

    const response = await fetch(`${API_ENDPOINT}${url}`)
        .then((response) => {
            return response.json()
        })
        .catch(error => {
            console.error(error)
        });
    console.log(response)
    return response;
};

export const searchRandomMovies = () => {
    const url = `/peliculas/random`


    return fetch(`${API_ENDPOINT}${url}`)
        .then((response) => response.json())
        .catch(error => {
            console.error(error)
        });

}

export const searchMovieDetails = (id) => {
    const url = `/peliculas/${id}`

    return fetch(`${API_ENDPOINT}${url}`)
        .then((response) => { return response.json() })
        .catch((error) => {
            console.error(error)
            return false
        });
}

export const deleteMovie = async (id) => {
    const url = `/peliculas/${id}`

    const response = await fetch(`${API_ENDPOINT}${url}`, {
        method: 'DELETE'
    })
        .then((response) => {
            return true;

        }

        )
        .catch((error) => {
            console.error(error)
            return error
        })


    return response;

}

export const newMovie = async (data) => {
    const url = '/peliculas'

    const response = await fetch(`${API_ENDPOINT}${url}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            console.log(response.status)
            if (response.status == 200)
                return true;
            else {
                console.log(response.text)
                return false;
            }
        })
        .catch((error) => {
            console.error(error)
            return error;
        })

    return response;
}

export const showPages = async (number) => {
    const url = `/peliculas/pagina/${number}`

    const response = await fetch(`${API_ENDPOINT}${url}`)
        .then((response) => {
            return response.json()
        })
        .catch((error) => {
            console.log(error)
            return false;
        });

    return response;
}

export const fetchMovieTilte = async (title) => {
    const url = `/peliculas/titulo/${encodeURIComponent(title)}`

    const response = await fetch(`${API_ENDPOINT}${url}`)
        .then((response) => {
            return response.json()
        })
        .catch((error) => {
            console.log(error)
            return false;
        })

    return response;
}

export const fetchRegisterUser = async (user) => {
    const url = "/usuarios/register"
    console.log(user)
    const response = await fetch(`${API_ENDPOINT}${url}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    }).then((response) => {
        if (response) {
            console.log(response)
            return response.text();
        } else {
            throw new Error('Error en la solicitud HTTP');
        }

    }).then(data => {
        console.log(data)
        return data;
    })
        .catch((error) => {
            console.log(error)
            return false;
        })

    return response;
}

export const fetchLogInUser = async (user) => {
    const url = "/usuarios/login"

    const response = await fetch(`${API_ENDPOINT}${url}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    }).then((response) => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Error en la solicitud HTTP');
        }
    }).then(data => {
        console.log(data)
        return data;
    })
        .catch((error) => {
            console.log(error)
            return false;
        })

    return response;
}

export const confirmAccount = async (token) => {
    const url = `/usuarios/confirmar-cuenta?token=${token}`

    const response = await fetch(`${API_ENDPOINT}${url}`)
        .then((response) => {
            if (response) {
                return response.text();
            } else {
                throw new Error('Error en la solicitud HTTP');
            }
        }).then(data => {
            console.log(data)
            return data;
        })
        .catch((error) => {
            console.log(error)
            return false;
        })

    return response;
}

export const fetchGetUsuario = async (email) => {
    const url = `/usuarios/${email}`

    console.log(`${API_ENDPOINT}${url}`)

    const response = await fetch(`${API_ENDPOINT}${url}`)
        .then((response) => {
            return response.json()
        })
        .catch(error => {
            console.error(error)
        });
    console.log(response)
    return response;
}

export const fetchCategorias = async () => {
    const url = '/categorias'

    const response = await fetch(`${API_ENDPOINT}${url}`)
        .then((response) => {
            return response.json()
        })
        .catch(error => {
            console.error(error)
        });
    console.log(response)
    return response;
}

export const fetchUserList = async () => {
    const url = '/usuarios'

    const response = await fetch(`${API_ENDPOINT}${url}`)
        .then((response) => {
            return response.json()
        })
        .catch(error => {
            console.error(error)
        })
    return response;
}

export const fetchRolList = async () => {
    const url = '/roles'

    const response = await fetch(`${API_ENDPOINT}${url}`)
        .then((response) => {
            return response.json()
        })
        .catch(error => {
            console.error(error)
        })
    return response;
}

export const fetchAllCinemas = async () => {
    const url = '/cines'

    const response = await fetch(`${API_ENDPOINT}${url}`)
        .then((response) => {
            return response.json()
        })
        .catch(error => {
            console.error(error)
        })
    return response;
}

export const fetchAllCitys = async () => {
    const url = '/ciudades'

    const response = await fetch(`${API_ENDPOINT}${url}`)
        .then((response) => {
            return response.json()
        })
        .catch(error => {
            console.error(error)
        })
    return response;
}

export const fetchAllFunction = async () => {
    const url = '/funciones'

    const response = await fetch(`${API_ENDPOINT}${url}`)
        .then((response) => {
            return response.json()
        })
        .catch(error => {
            console.error(error)
        })
    return response;
}

export const fetchSearchFunction = async (cine, pelicula) => {
    const url = `/funciones/buscador?cine=${cine}&pelicula=${pelicula}`
    const response = await fetch(`${API_ENDPOINT}${url}`)
        .then((response) => {
            return response.json()
        })
        .catch(error => {
            console.error(error)
        })
    return response;
}

export const fetchCinemaForTitle = async (titulo) => {
    const url = `/cines/buscar/${titulo}`
    const response = await fetch(`${API_ENDPOINT}${url}`)
        .then((response) => {
            return response.json()
        })
        .catch(error => {
            console.error(error)
        })
    return response;
}

export const fetchReserve = async (reserva) => {
    const url = '/reservas'
    console.log(JSON.stringify(reserva))
    const response = await fetch(`${API_ENDPOINT}${url}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reserva),
    }).then((response) => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Error en la solicitud HTTP');
        }
    }).then(data => {
        console.log(data)
        return data;
    })
        .catch((error) => {
            console.log(error)
            return false;
        })

    return response;
}

export const fetchRanking = async (id) => {
    const url = `/puntajes/${id}`
    const response = await fetch(`${API_ENDPOINT}${url}`)
        .then((response) => {
            return response.json()
        })
        .catch(error => {
            console.error(error)
        })
    return response;
}

export const postRanking = async (rank) => {
    const url = '/puntajes'
    console.log(JSON.stringify(rank))
    const response = await fetch(`${API_ENDPOINT}${url}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(rank),
    }).then((response) => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Error en la solicitud HTTP');
        }
    }).then(data => {
        console.log(data)
        return data;
    })
        .catch((error) => {
            console.log(error)
            return false;
        })

    return response;
}

export const searchCategoriesMovies = async (page, categorie) => {
    const url = `/peliculas/pagina/${page}/${categorie}`
    const response = await fetch(`${API_ENDPOINT}${url}`)
        .then((response) => {
            return response.json()
        })
        .catch(error => {
            console.error(error)
        })
    return response;
}

export const searchFavorite = async (email) => {
    const url = `/favoritos/${encodeURIComponent(email)}`
    const response = await fetch(`${API_ENDPOINT}${url}`)
        .then((response) => {
            return response.json()
        })
        .catch(error => {
            console.error(error)
        })
    return response;
}

export const updateFavorite = async (id, body) => {
    const url = `/favoritos/${id}`
    const response = await fetch(`${API_ENDPOINT}${url}`, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then((response) => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Error en la solicitud HTTP');
        }
    }).then(data => {
        console.log(data)
        return data;
    })
        .catch((error) => {
            console.log(error)
            return false;
        })
}

export const fetchUserReserves = async (email) => {
    const url = `/reservas/usuario/${email}`
    const response = await fetch(`${API_ENDPOINT}${url}`)
        .then((response) => {
            return response.json()
        })
        .catch(error => {
            console.error(error)
        })
    return response;
}

export const fetchUpdateReserve = async (data) => {
    const url = `/reservas`
    const response = await fetch(`${API_ENDPOINT}${url}`, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((response) => {
        return true
    }).then(data => {
        console.log(data)
        return data;
    })
        .catch((error) => {
            console.log(error)
            return false;
        })
    return response
}

export const fetchAllPolicys = async () => {
    const url = `/politicas`
    const response = await fetch(`${API_ENDPOINT}${url}`)
    .then((response) => {
        return response.json()
    })
    .catch(error => {
        console.error(error)
    })
    return response;
}

export const updatePolicys = async (data) => {
    const url = '/politicas'
    const response = await fetch(`${API_ENDPOINT}${url}`, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((response) => {
        return true
    }).then(data => {
        console.log(data)
        return data;
    })
        .catch((error) => {
            console.log(error)
            return false;
        })
    return response
}

export const savePolicys = async (data) => {
    const url = '/politicas'
    const response = await fetch(`${API_ENDPOINT}${url}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((response) => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Error en la solicitud HTTP');
        }
    }).then(data => {
        console.log(data)
        return data;
    })
        .catch((error) => {
            console.log(error)
            return false;
        })

    return response;
}

export const fetchToMp = async (data) => {
    const url = `${API_ENDPOINT}/api/mercado-pago/crear-preferencia${data}`
    const newUrl = encodeURI(url)
    const response = await fetch(newUrl)
    .then((response) => {
        return response.text()
    })
    .catch(error => {
        console.error(error)
    })
    return response;
}

export const actualizarButaca = async (data) => {
    const url = '/butacas'
    const response = await fetch(`${API_ENDPOINT}${url}`, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((response) => {
        return true
    }).then(data => {
        console.log(data)
        return data;
    })
        .catch((error) => {
            console.log(error)
            return false;
        })
    return response
}