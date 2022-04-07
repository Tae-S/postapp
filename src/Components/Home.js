//ADDED: login and register
//TODO: if curr_user logged in show popular posts etc.
//TODO: only onfocus of input[name='comment'] show commenting as ..., otherwise show ...
//TODO: clear comments textarea of that post after submitting comment
import './homeStyles.css'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { register, login } from '../features/users'
import { loggedInUser } from '../features/user'
// import { loginAuth, registerAuth } from '../utils/auth'
import { useNavigate } from 'react-router-dom'
import { comment, editComment } from '../features/comments'
import { miniComment, editMiniComment } from '../features/miniComments'
import { passwordAuth } from '../utils/auth'
import menuSmall from '../images/menu-vertical-24.png'
import menuHSmall from '../images/menu-horizontal.png'
import { editPost } from '../features/posts'

function Home()
{
    const navigate = useNavigate()
    const usersList = useSelector(state => state.users.value)
    const postsList = useSelector(state => state.posts.value)
    const cList = useSelector(state => state.comments.value)
    const mCList = useSelector(state => state.miniComments.value)
    const current_user = useSelector(state => state.user.value)
    const dispatch = useDispatch()
    const lastLoggedIn = {username: '', isLoggedIn: false}
    const [fLogin, setFLogin] = useState(true) //ADDED: button-text-control
    const [values, setValues] = useState({
        username: '',
        password: '',
    })
    const [cValues, setCValues] = useState([])
    const [mCValues, setMCValues] = useState([])
    const handleSubmit = e => {
        e.preventDefault()
        // console.log('prevented reloading')
        const _password = passwordAuth(values.password)
        if(fLogin) dispatch(login({...values, password: _password}))
        else{
            console.log('trying to register with values: ', values)
            dispatch(register({...values, password: _password}))
        }
        //see if logged in successfully or not
        lastLoggedIn.username = values.username
        lastLoggedIn.isLoggedIn = true
        dispatch(loggedInUser({...lastLoggedIn, password:values.password}))
        setValues({
            username: '',
            password: ''
        })
        if(lastLoggedIn.isLoggedIn) navigate('/profile')

    }
    const handleChange = e => {
        setValues(prevState => {
            if(e.target.name === 'username') return {...prevState, username:e.target.value}
            else if(e.target.name === 'password') return {...prevState, password:e.target.value}
        })
    }
    useEffect(()=>{
        let _dummy = []
        let _mini_dummy = []
        // console.log('clist: ', cList)
        if(postsList){
            for(let i=0; i<postsList.length; i++) _dummy.push({body: '', postId: i})
        }
        else _dummy.push({body: '', postId: 0})
        if(cList){
            for(let i=0; i<cList.length; i++) _mini_dummy.push({body: '', postId: i})
        }
        else _mini_dummy.push({body: '', postId: 0})
        setCValues(_dummy)
        setMCValues(_mini_dummy)
        // console.log(cList)
    }, [cList, postsList])
    useEffect(()=>{
        if(lastLoggedIn.username !== '' && lastLoggedIn.isLoggedIn){
            //redirect to profile page
        }
        return ()  => {}
    }, [lastLoggedIn])
    // useEffect(()=>{
    //     console.log('mCValues: ',mCValues)
    //     return ()=> {}
    // })
    //post handlers
    const handleCommentSubmit = e => {
        e.preventDefault()  
        const _onPost = e.target.dataset.postid
        const {body, postId} = cValues[parseInt(_onPost)]
        console.log({username: current_user.username, body, postId, timestamp: new Date().toLocaleString() })
        dispatch(comment({username: current_user.username, body, postId, timestamp: new Date().toLocaleString() }))
        setCValues(prevState =>{
            prevState[parseInt(_onPost)].body = ''
            return prevState
        })
        
    }
    const handleCommentChange = e => {
        //setvalues after checking if on the same post-id
        const _onPost = e.target.dataset.postid
        setCValues(prevState => {
            return prevState.map(p=>{ return p.postId == _onPost?{...p,body:e.target.value} : p})
        })
    }
    //MiniComments handlers
    const handleMiniCommentChange = e => {
        const _onComment = parseInt(e.target.dataset.postid)
        // console.log(_onComment)
        setMCValues(prevState => {
            return prevState.map(p=>{ return p.postId == _onComment?{...p,body:e.target.value} : p})
        })
    }
    const handleMiniCommentSubmit = e => {
        e.preventDefault()
        console.log(mCValues)
        const _onComment = e.target.dataset.postid
        console.log(_onComment)
        const {body, postId} = mCValues[parseInt(_onComment)]
        // console.log({username: current_user.username, body, postId, timestamp: new Date().toLocaleString() })
        dispatch(miniComment({username: current_user.username, body, postId, timestamp: new Date().toLocaleString() }))
        setMCValues(prevState =>{
            prevState[parseInt(_onComment)].body = ''
            return prevState
        })
    }
    // ADDED: popup handlers miniComment
    const handleMCMenuClick = e => {
        // console.log('clicked')
        //change display of that popup
        const _data = e.target.dataset.pop
        const _popup = document.querySelector(`.mc-pop[data-pop="${_data}"]`)
        // console.log(_popup)
        if(_popup.style.display === 'block') _popup.style.display = 'none'
        else _popup.style.display = 'block'
    }
    const handleMCEdit = e => {
        //payload structure: username, id, body, timestamp
        //show the hidden input
        const _data = e.target.dataset.pop
        const _popup = document.querySelector(`.mc-pop-inp-div[data-pop="${_data}"]`)
        _popup.style.display = 'block'
        const _body = document.querySelector(`.mc-pop-inp[data-pop="${_data}"]`)
        const _og = document.querySelector(`.mc-body[data-pop="${_data}"]`)
        _body.value = _og.textContent
    }
    const handleMCEditSubmit = e => {
        e.preventDefault()
        const _time = new Date().toLocaleString()
        const _id = e.target.dataset.pop
        const _data = e.target.dataset.pop
        const _body = document.querySelector(`.mc-pop-inp[data-pop="${_data}"]`)
        const _ogTime = document.querySelector(`.mc-time[data-pop="${_data}"]`).textContent
        // console.log(_ogTime)
        // console.log({timestamp: _time, id: _id, username: current_user.username, body: _body.value})
        //hide the _popup form
        
        const _popup = document.querySelector(`.mc-pop-inp-div[data-pop="${_data}"]`)
        _popup.style.display = 'none'
        dispatch(editMiniComment({timestamp: _time, id: _id, username: current_user.username, body: _body.value, ogTime: _ogTime}))
        
    }
    const handleMCDelete = e => {
        //dispatch event
    }
    // ADDED: popup handlers post
    const handlePostMenuClick = e => {
        // console.log('clicked')
        const _data = e.target.dataset.pop
        const _popup = document.querySelector(`.p-pop[data-pop="${_data}"]`)
        // console.log(_popup)
        if(_popup.style.display === 'block') _popup.style.display = 'none'
        else _popup.style.display = 'block'
    }
    const handlePostEdit = e => {
        const _data = e.target.dataset.pop
        const _popup = document.querySelector(`.p-pop-inp-div[data-pop="${_data}"]`)
        _popup.style.display = 'block'
        const _title = document.querySelector(`.p-pop-inp-title[data-pop="${_data}"]`)
        const _body = document.querySelector(`.p-pop-inp-body[data-pop="${_data}"]`)
        const _og_body = document.querySelector(`.p-body[data-pop="${_data}"]`)
        const _og_title = document.querySelector(`.p-title[data-pop="${_data}"]`)
        _body.value = _og_body.textContent
        _title.value = _og_title.textContent
    }
    const handlePostEditSubmit = e => {
        e.preventDefault()
        const _time = new Date().toLocaleString()
        const _id = e.target.dataset.pop
        const _data = e.target.dataset.pop
        const _body = document.querySelector(`.p-pop-inp-body[data-pop="${_data}"]`)
        const _title = document.querySelector(`.p-pop-inp-title[data-pop="${_data}"]`)
        //hide the _popup form
        // console.log(_body, _title)
        const _popup = document.querySelector(`.p-pop-inp-div[data-pop="${_data}"]`)
        _popup.style.display = 'none'
        dispatch(editPost({timestamp: _time, id: _id, username: current_user.username, body: _body.value, title: _title.value}))
    }
    const handlePostDelete = e => {

    }
    // ADDED: comment popup edit
    const handleCMenuClick = e => {
        // console.log('clicked')
        const _data = e.target.dataset.pop
        const _popup = document.querySelector(`.c-pop[data-pop="${_data}"]`)
        // console.log(_popup)
        if(_popup.style.display === 'block') _popup.style.display = 'none'
        else _popup.style.display = 'block'
    }
    const handleCEdit = e => {
        const _data = e.target.dataset.pop
        const _popup = document.querySelector(`.c-pop-inp-div[data-pop="${_data}"]`)
        _popup.style.display = 'block'
        const _body = document.querySelector(`.c-pop-inp-body[data-pop="${_data}"]`)
        const _og_body = document.querySelector(`.c-body[data-pop="${_data}"]`)
        // console.log(_og_body, _og_body.textContent)
        _body.value = _og_body.textContent
    }
    const handleCEditSubmit = e => {
        e.preventDefault()
        const _time = new Date().toLocaleString()
        const _id = e.target.dataset.pop
        const _data = e.target.dataset.pop
        const _body = document.querySelector(`.c-pop-inp-body[data-pop="${_data}"]`)
        const _ogTime = document.querySelector(`.c-time[data-pop="${_data}"]`).textContent
        //hide the _popup form
        // console.log(_body)
        const _popup = document.querySelector(`.c-pop-inp-div[data-pop="${_data}"]`)
        _popup.style.display = 'none'
        dispatch(editComment({timestamp: _time, id: _id, username: current_user.username, body: _body.value, ogTime: _ogTime}))
    }
    const handleCDelete = e => {

    }
    return(
        <>
            <div className="home-container">
                {current_user.isLoggedIn?(
                    //show posts
                    postsList.map((p, _in) =>(
                        <div className='post-card' key={_in}>
                            <h4 data-pop={_in} className='title p-title' data-postid={_in}>{p.title}</h4>
                            <p className='username p-username' data-postid={_in}><strong>{p.username}</strong> posted</p>
                            {p.file!==null && p.file!=undefined && p.file.length > 5 ?<img data-postid={_in} src={p.file} />: null}
                            <p data-pop={_in} className='body p-body' data-postid={_in}>{p.body}</p>
                            {/* post edit popup */}
                            <div data-pop={_in} className='menu p-menu'>
                                {/* <div className='p-menu-img' onClick={e => handlePostMenuClick(e)}> */}
                                    <img className='p-menu-img' data-pop={_in} src={menuHSmall} onClick={e => handlePostMenuClick(e)} />
                                {/* </div> */}
                                <div data-pop={_in} className='pop p-pop'>
                                    <p data-pop={_in} onClick={e => handlePostEdit(e)}>Edit</p>
                                    <p data-pop={_in} onClick={e => handlePostDelete(e)}>Delete</p>
                                </div>
                                <form className='p-pop-inp-div' data-pop={_in} onSubmit={e => handlePostEditSubmit(e)}>
                                    <input data-pop={_in} type='text' className='p-pop-inp-title inp-inp' />
                                    <input data-pop={_in} type='text' className='p-pop-inp-body inp-inp' />
                                    <input data-pop={_in} type='submit' value='Save' className='btn p-pop-btn' onSubmit={e => handlePostEditSubmit(e)} />
                                </form>
                            </div>
                            {/* end post edit popup */}
                            <div className='comments-container'>
                                {cList.length!==0?(
                                    cList.map((c,__in) =>(
                                        <div className='comment-card' key={__in}>      
                                            {c.postId === _in?(
                                                <>
                                                    <p className='username c-username'>commented by, {c.username}</p>
                                                    <p data-pop={__in} className='body c-body'>{c.body}</p>
                                                    <p data-pop={__in} className='time c-time'>{c.timestamp}</p>
                                                    {/* comment edit */}
                                                    <div data-pop={__in} className='menu c-menu'>
                                                        <div className='c-menu-img' onClick={e => handleCMenuClick(e)}><img data-pop={__in} src={menuSmall} /></div>
                                                        <div data-pop={__in} className='pop c-pop'>
                                                            <p data-pop={__in} onClick={e => handleCEdit(e)}>Edit</p>
                                                            <p data-pop={__in} onClick={e => handleCDelete(e)}>Delete</p>
                                                        </div>
                                                        <form className='c-pop-inp-div' data-pop={__in} onSubmit={e => handleCEditSubmit(e)}>
                                                            <input data-pop={__in} type='text' name='cedit' className='c-pop-inp-body inp-inp' />
                                                            <input data-pop={__in} type='submit' value='Save' className='btn c-pop-btn' onSubmit={e => handleCEditSubmit(e)} />
                                                        </form>
                                                    </div>
                                                    <form className={`mini-${__in}`} method='POST' data-postid={__in} action='/' onSubmit={e => handleMiniCommentSubmit(e)}>
                                                        <input className='inp-inp c-inp' type='text' name='minicomment' placeholder={`commenting as ${current_user.username}`} data-postid={__in} onChange={e => handleMiniCommentChange(e)} required/>
                                                        <input className='btn c-btn' form={`mini-${__in}`} data-postid={__in} type='submit' value='Comment' onClick={(e) => handleMiniCommentSubmit(e)}/>
                                                    </form>
                                                    {/* comments on comment */}
                                                    {mCList.length!==0?(
                                                        mCList.map((mc, ___in) =>(
                                                            <div className='mini-comment-card' key={___in}>
                                                                {mc.postId === __in?(
                                                                    <>
                                                                        <p className='username mc-username'>by: {mc.username}</p>
                                                                        <p data-pop={___in} className='body mc-body'>{mc.body}</p>
                                                                        <p data-pop={___in} className='time mc-time'>{mc.timestamp}</p>
                                                                        {/* mini comment edit */}
                                                                        <div data-pop={___in} className='menu mc-menu'>
                                                                            <div className='mc-menu-img' onClick={e => handleMCMenuClick(e)}><img data-pop={___in} src={menuSmall} /></div>
                                                                            <div data-pop={___in} className='pop mc-pop'>
                                                                                <p data-pop={___in} onClick={e => handleMCEdit(e)}>Edit</p>
                                                                                <p data-pop={___in} onClick={e => handleMCDelete(e)}>Delete</p>
                                                                            </div>
                                                                            <form className='mc-pop-inp-div' data-pop={___in} onSubmit={e => handleMCEditSubmit(e)}>
                                                                                <input data-pop={___in} type='text' name='mcedit' className='mc-pop-inp inp-inp' />
                                                                                <input data-pop={___in} type='submit' value='Save' className='btn mc-pop-btn' onSubmit={e => handleMCEditSubmit(e)} />
                                                                            </form>
                                                                        </div>
                                                                    </>
                                                                ): null}
                                                            </div>
                                                        ))
                                                    ):null}
                                                </>
                                            ):null}
                                        </div>
                                    ))
                                ) : null}
                            
                                <form className={`c-${_in}`} method='POST' data-postid={_in} action='/' onSubmit={e => handleCommentSubmit(e)}>
                                    <textarea className='inp-inp p-inp' type='text' name='comment' placeholder={`commenting as ${current_user.username}`} data-postid={_in} onChange={e => handleCommentChange(e)} required></textarea>
                                    <input className='btn p-btn' form={`c-${_in}`} data-postid={_in} type='submit' value='Comment' onClick={(e) => handleCommentSubmit(e)}/>
                                </form>
                            </div>
                        </div>
                        )
                    )
                ):(
                <>
                    <form className='login-form' action="/" method='POST' onSubmit={(e)=>handleSubmit(e)}>
                        <label className='login-label'>
                            Username:
                            <input className='inp-inp' type='text' placeholder='username' name='username' onChange={(e)=> handleChange(e)} required value={values.username}/>
                        </label>
                        <label className='login-label'>
                            Password:
                            <input className='inp-inp' type='password' placeholder='••••••••' name='password' onChange={(e)=> handleChange(e)} required value={values.password}/>
                        </label>
                        <input className='login-btn btn' type='submit' value={fLogin?'Login':'Register'}  onSubmit={(e) => handleSubmit(e)}/>
                    </form>
                    <input className='login-login btn' type='button' value={fLogin?'Register':'Login'} onClick={()=> setFLogin(prevState => !prevState)}/>
                    <input className='btn' type='button' value='admin: clear-storage' onClick={()=>{localStorage.clear(); console.warn('cleared database')}}/>
                </>
                )}
            </div>
        </>
    )
}

export default Home