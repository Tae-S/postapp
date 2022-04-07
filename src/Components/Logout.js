import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Logout()
{
    const navigate = useNavigate()
    useEffect(()=>{
        setTimeout(()=>{
            navigate('/')
        }, 1000)
        return ()=>{}
    })
    return(
        <>
            <p>You successfully logged out.</p>
        </>
    )
}

export default Logout