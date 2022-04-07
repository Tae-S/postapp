import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Login()
{
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const [loginSuccess, setLoginSuccess] = useState(false)
    if(currentUser.isLoggedIn && currentUser.username !== '') setLoginSuccess(true)
    //navigate to profile
    useEffect(()=>{
        setTimeout(()=>{
            if(loginSuccess)navigate('/profile')
            else navigate('/')
        }, 1000)
        return ()=>{}
    })
    dispatch(loggedInUser({username, isLoggedIn}))
    return(
        <p>{loginSuccess? 'You successfully logged in, redirecting...': 'Invalid credentials,please try again'}</p>
    )
}

export default Login