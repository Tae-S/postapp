import { createSlice } from '@reduxjs/toolkit'
import { loginAuth, registerAuth } from '../utils/auth'
// import { loggedInUser } from './user'
// import { useDispatch } from 'react-redux'

let initial = null
try{
    initial = JSON.parse(localStorage.getItem('users'))
}catch(err){
    console.log(err)
}
initial = initial === null? [] : initial



export const usersSlice = createSlice({
    name: 'users',
    initialState: { value: Object.keys(initial).length === 0?[] : initial },
    reducers: {
        login: (state, action) => {
            console.log('tried to login with ', action, ' details')
            //check if user exists and correct password
            const valid = loginAuth(action.payload)
            if(valid.isValid){
                //successfully authorized
                console.log('Login Successful')
                // Dispatch({username: action.payload.username, isLoggedIn: true, validity: true})
                //add to local storage currentUser
                localStorage.setItem('currentUser', JSON.stringify({username: action.payload.username, isLoggedIn: true}))
            }
            else{
                console.log('failed to login')
                // Dispatch({username: '', isLoggedIn: false, validity: false})
                localStorage.setItem('currentUser', JSON.stringify({username: '', isLoggedIn: false}))
            }
        },
        register: (state, action) => {
            // console.log('tried registering with data, ', action)
            const user = {...action.payload, isLoggedIn: true}
            const valid = registerAuth(action.payload)
            // console.log('validity: ', valid, ' for values: ', action.payload, user)
            if(valid.isValid){
                console.log('Operation successful')
                state.value.push(user)
                localStorage.setItem('users', JSON.stringify(state.value))
            }
            else console.log('Operation failed')
        },
    }
})



export const { login, register } = usersSlice.actions
export default usersSlice.reducer