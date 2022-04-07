//ADDED: authorization for login and register
import bcrypt from 'bcryptjs'
const salt = bcrypt.genSaltSync(12)



function loginAuth({username, password})
{
    const users = JSON.parse(localStorage.getItem('users'))
    console.log('from login auth: ', users)
    if(users){
        const user = users.filter(u=>u.username === username) //&& u.password === password)
        console.log(user, user[0].password)
        if(user.length !== 0){
            //found user and matched the password //TODO: use bcrypt later
            const _isValid = bcrypt.compareSync(password, user[0].password)
            return {
                isValid: _isValid,
                isLoggenIn: _isValid
            }
        }
        else{
            return {
                isValid: false,
                isLoggenIn: false
            }
        }
    }
    else{
        console.log('Register first')
        return {
            isValid: false,
            isLoggenIn: false
        }
    }
}


function registerAuth({username, password})
{
    const users = JSON.parse(localStorage.getItem('users'))
    // console.log('from register auth: ', users, values)
    //find if user already exists
    if(users){
        const user = users.filter(u=>u.username === username)
        console.log(user.length === 0)
        if(user.length !== 0){
            return {
                isValid: false,
                isLoggenIn: false
            }
        }
        else{
            return{
                isValid: true,
                isLoggenIn: true
            }
        }
    }
    else{
        console.log('user base empty')
        return {
            isValid: true,
            isLoggenIn: true
        }
    }
    
}

function postsAuth({username, title, body, file})
{
    if(username === '' || title.trim().length === 0 || body.trim().length === 0) return{isValid: false}
    else return{isValid: true}
}

function commentsAuth({username, body})
{
    if(username !== '' && body.trim().length !== 0) return {isValid: true}
    else return {isValid: false}
}

function passwordAuth(password)
{
    const hash = bcrypt.hashSync(password, salt)
    return hash
}

//redundant
function serialize(file)
{
    //serializing file
    const imgPath = file
    const reader = new FileReader()
    let result = null
    if(imgPath) reader.readAsDataURL(imgPath)
    reader.addEventListener("load", function () {
        // convert image file to base64 string and save to localStorage
        // setValues(prevState =>{return {...prevState, file: reader.result}})
        result = reader.result
        console.log('reader result from inside', reader.result)
        return result
    }, false)

    
    //end serializing file
    // if(result === null) console.log('reader.result is null')
    
}

export { loginAuth, registerAuth, postsAuth, serialize, commentsAuth, passwordAuth }