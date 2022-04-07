import { createSlice } from "@reduxjs/toolkit"
import { postsAuth } from '../utils/auth'

let initial = null
try{
    initial = JSON.parse(localStorage.getItem('posts'))
}catch(err){
    console.log(err)
}
initial = initial === null? [] : initial


export const postsSlice = createSlice({
    name: 'posts',
    initialState: {value: initial},
    reducers: {
        post: (state, action) => {
            //auth the post and store it in localstorage
            const valid = postsAuth(action.payload)
            if(valid.isValid){
                //update localstorage
                state.value.push(action.payload)
                localStorage.setItem('posts', JSON.stringify(state.value))
                console.log('Posted!')
            }
            else{
                console.log('invalid username/not permitted to post.')
            }
        },
        editPost: (state, action) => {
            //TODO: auth the edit
            console.log(action.payload)
            state.value.map(v => {
                // console.log(v.timestamp == action.payload.ogTime)
                // console.log(v.id, v.username)
                if(v.id == action.payload.id && v.username == action.payload.username ){
                    // console.log(v.body, 'in here')
                    v.title = action.payload.title
                    v.body = action.payload.body
                    v.timestamp = action.payload.timestamp
                }
                return v
            })
            // console.log(_temp)
            localStorage.setItem('posts', JSON.stringify(state.value))
            console.log('edited successfully')
        }
    }
})

export const { post, editPost } = postsSlice.actions
export default postsSlice.reducer