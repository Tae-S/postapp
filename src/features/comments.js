import { createSlice } from '@reduxjs/toolkit'
import { commentsAuth } from '../utils/auth'

let initial = null
try{
    initial = JSON.parse(localStorage.getItem('comments'))
}catch(err){
    console.log(err)
}

initial = initial === null? []: initial

export const commentsSlice = createSlice({
    name: 'comments',
    initialState: {value: initial},
    reducers: {
        comment: (state, action) => {
            //validate the comment, update state and localstorage
            const valid = commentsAuth(action.payload)
            // console.log('tried commenting with: ', action.payload)
            if(valid.isValid){
                console.log('Commented successfully')
                state.value.push(action.payload)
                localStorage.setItem('comments', JSON.stringify(state.value))
                //comments structure: username, on-post-id: body, timestamp
            }
            else console.log('Failed to comment')
        },
        editComment: (state, action) => {
            state.value.map(v => {
                // console.log(v.timestamp == action.payload.ogTime)
                // console.log(v.postId, v.username, v.timestamp)
                if(v.timestamp == action.payload.ogTime && v.username == action.payload.username){//&&v.postId == action.payload.id && 
                    // console.log(v.body, 'in here')
                    v.body = action.payload.body
                    v.timestamp = action.payload.timestamp
                }
                return v
            })
            localStorage.setItem('comments', JSON.stringify(state.value))
            console.log('edited successfully')
        }
    }
})

export const { comment, editComment } = commentsSlice.actions
export default commentsSlice.reducer