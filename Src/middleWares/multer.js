
import multer from "multer"
import { allowedExtensions } from "../utils/allowedExtensions.js"




 const multerMiddleWare = ({
    extensions = allowedExtensions.image,
}) => {

    // diskStorage
    const storage = multer.diskStorage({
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    })

    // file Filter
    const fileFilter = (req, file, cb) => {
        if (extensions.includes(file.mimetype.split('/')[1])) {
            return cb(null, true)
        }
        cb(new Error('Image format is not allowed!'), false)
    }


    const file = multer({ fileFilter, storage })
    return file
}


export default multerMiddleWare ;