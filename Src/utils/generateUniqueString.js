import { customAlphabet } from 'nanoid'

const generateUniqueString = ( signature , length) => {
    const nanoid = customAlphabet( signature ||'123456789asdfgh', length || 10)
    return nanoid()
}


export default generateUniqueString ;