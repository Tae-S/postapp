import './navbarStyles.css'
import { Link } from 'react-router-dom'
import { logout } from '../features/user'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
//TODO: change LINK to'/profile to have the username as the text
function Navbar()
{
    const currentUser = useSelector(state => state.user.value)
    const dispatch = useDispatch()
    const [curr_user, setCurr_User] = useState('')
    
    useEffect(()=>{
        if(currentUser.isLoggedIn) setCurr_User(currentUser)    
        return ()=>{}
    })
    const handleClick = e => {
        if(curr_user !== ''){
            console.log('logging out through dispatch')
            console.log(currentUser, 'from logout click')
            setCurr_User('')
            dispatch(logout())
        }
    }
    return(
        <>
            <ul className="nav-ul">
                <li className="nav-li">
                    <Link className='nav-link' to='/'>Home</Link>
                </li>
                <li className="nav-li">
                    <Link className='nav-link' to='/profile'>{curr_user.username}</Link>
                </li>
                <li className="nav-li">
                    <Link onClick={(e)=>handleClick(e)} className='nav-link' to={curr_user===''?'/':'/logout'}>{curr_user===''?'Login':'Logout'}</Link>
                </li>
            </ul>
        </>
    )
}

export default Navbar