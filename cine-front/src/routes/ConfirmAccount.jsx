import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { confirmAccount } from "../components/UseFetch";




function ConfirmAccount() {
    const [message, setMessage] = useState('')
    const location = useLocation()
    const searchParam = new URLSearchParams(location.search);
    const token = searchParam.get('token')

    useEffect(() => {
        const accountConfimation = async () => {
            try {
                const response = await confirmAccount(token)
    
                if (response != false && response != null) {
                    console.log(response)
                    setMessage(response)
                } else{
                    setMessage("Hubo un error")
                }
            } catch (error) {
                setMessage("Hubo un error.")
            }
        }
    
        accountConfimation();
    },[])



    return (
        <div className="confirm-email-conteiner">
            <div className="confirm-email-content">
                <img src="./icons/dhcinema2-logo.png" />
                <div className="confirm-email">
                    <h1>Confirmación de cuenta</h1>

                    {message}

                    <button><a href="http://18.220.249.237:5173/">VOLVER A DHCINEMA</a></button>
                </div>

            </div>

        </div>);
}

export default ConfirmAccount;