import React from 'react'

const BloquePoliticas = ({policys}) => {
  return (
    <div className='bloquePoliticas'>
        <div className='politicas1'><div>
              <h3>Normas de la sala</h3>
              <p>{policys.normasDeLaSala}</p>
          </div>
          
        </div>
        <div className='politicas2'>
          <div>
              <h3>Salud y seguridad</h3>
              <p>{policys.saludYSeguridad}</p>
          </div>
        </div>
        <div className='politicas3'>
          <div>
              <h3>Política de cancelación</h3>
              <p>{policys.politicaDeCancelacion}</p>
          </div>
        </div>
        
        
    </div>
    
    
  )
}

export default BloquePoliticas