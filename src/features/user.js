import { createSlice } from '@reduxjs/toolkit'
import { loginAuth } from '../utils/auth'

let initial = null
try{
    initial = JSON.parse(localStorage.getItem('user'))
}catch(err){
    console.log(err)
}
initial = initial === null? {username: '', isLoggedIn: false} : initial

export const userSlice = createSlice({
    name: 'user',
    initialState: {value: Object.keys(initial).length === 0?{username: '', isLoggedIn: false} : initial},
    reducers: {
        loggedInUser: (state, action) => {
            console.log('user trying to log in is: ', action.payload)
            state.value = {username: '', isLoggedIn: false}
            localStorage.setItem('user', JSON.stringify(state.value))
            const valid = loginAuth(action.payload)
            if(valid.isValid){
                const {username, isLoggedIn} = action.payload
                state.value = {username, isLoggedIn}
                console.log(state.value.isLoggedIn, state.value.username, 'state value of user')
                localStorage.setItem('user', JSON.stringify(state.value))
            }
            else console.log('could not login with provided credentials')
        },
        logout: (state, action) => {
            //logout here
            console.log('logged out successfully')
            state.value = {username: '', isLoggedIn: false}
            localStorage.setItem('user', JSON.stringify(state.value))
            localStorage.setItem('currentUser', JSON.stringify({username: '', isLoggedIn: false}))
        }
    }
})

export const { loggedInUser, logout } = userSlice.actions
export default userSlice.reducer