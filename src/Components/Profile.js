//ADDED: posts of the logged in user
import './profileStyles.css'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { post } from '../features/posts'
// import { serialize } from '../utils/auth'

function Profile()
{
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [values, setValues] = useState({
        username: '',
        title: '',
        body: '',
        file: null
    })
    const loggedIn = useSelector(state=> state.user.value)
    const postsList = useSelector(state => state.posts.value)
    // console.log(loggedIn, ' logged in value from profile.js')
    //according to the username retrieve the posts from that user
    useEffect(()=>{
        //TODO: optionally send a message that current_user is not logged in as an user
        if(!loggedIn.isLoggedIn) navigate('/')
        else setValues(prevState => {
            return {...prevState, username: loggedIn.username}
        })
        return ()=>{}
    }, [loggedIn])
    const handleSubmit = e => {
        e.preventDefault()
        //authorize the post then dispatch
        console.log(values)
        // console.log(values.file[0])
        // const img = serialize(values.file[0])
        const imgPath = values.file === null? null : values.file[0]
        const reader = new FileReader()
        let result = null
        const {username, title, body } = values
        if(imgPath) reader.readAsDataURL(imgPath)
        reader.addEventListener("load", function () {
            result = reader.result
            console.log(result, ' is the img beng sent')
            
            dispatch(post({username, title, body, file: result, id: postsList?postsList.length:0}))
        }, false)
        if(values.file === null) dispatch(post({username, title, body, file: null, id: postsList?postsList.length:0}))
        //maybe add event listener remover
        
    }
    const files = document.querySelector('.post-file')
    const handleChange = e => {
        setValues(prevState => {
            // if(e.target.name === 'username') return {...prevState, username:e.target.value} // change after checking login status
            if(e.target.name === 'title') return {...prevState, title:e.target.value}
            else if(e.target.name === 'body') return {...prevState, body:e.target.value}
            else if(e.target.name === 'file'){
                return {...prevState, file: files.files}
            }
            console.log('files uploaded now are: ', files.files)
            
        })
    }
    return(
        <div className="profile-container">
            Post your thoughts!
            <div className='add-post-container'>
                <form action='/profile' method='POST' onSubmit={(e) => handleSubmit(e)}>
                    <label className='profile-label profile-title-label'>
                        Post title:
                        <input className='inp-inp pro-inp-title pro-inp' type='text' name='title' placeholder='Post title' onChange={(e)=> handleChange(e)} required/>
                    </label>
                    <label className='profile-label profile-body-label'>
                        Post Body:
                        <textarea className='inp-inp pro-inp-body pro-inp' name='body' placeholder='Write something' onChange={(e)=> handleChange(e)} required></textarea>
                    </label>
                    <label className='profile-label profile-file-label'>
                        Upload:
                        <input name='file' type='file' className='post-file inp-inp pro-inp-file pro-inp' onChange={(e)=> handleChange(e)}/>
                    </label>
                    <input className='btn pro-inp-btn' type='submit' value='Post' onSubmit={(e) => handleSubmit(e)}/>
                </form>
            </div>
            <div className='your-posts-container'></div>
        </div>
    )
}

export default Profile