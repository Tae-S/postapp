import { createSlice } from '@reduxjs/toolkit'
import { commentsAuth } from '../utils/auth'

let initial = null
try{
    initial = JSON.parse(localStorage.getItem('miniComments'))
}catch(err){
    console.log(err)
}

initial = initial === null? []: initial

export const miniCommentsSlice = createSlice({
    name: 'miniComments',
    initialState: {value: initial},
    reducers: {
        miniComment: (state, action) => {
            //validate the comment, update state and localstorage
            const valid = commentsAuth(action.payload)
            // console.log('tried commenting with: ', action.payload)
            if(valid.isValid){
                console.log('Commented on the comment successfully')
                state.value.push(action.payload)
                localStorage.setItem('miniComments', JSON.stringify(state.value))
                //comments structure: username, on-post-id: body, timestamp
            }
            else console.log('Failed to comment on the comment')
        },
        editMiniComment: (state, action) => {
            //TODO: auth the edit
            //use the postId to check
            // console.log(action.payload)
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
            // console.log(_temp)
            localStorage.setItem('miniComments', JSON.stringify(state.value))
            console.log('edited successfully')
        }
    }
})

export const { miniComment, editMiniComment } = miniCommentsSlice.actions
export default miniCommentsSlice.reducer