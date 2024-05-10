


export const globalResponse = async (err , req , res , next)=>{
    if(err) {
        return  res.status( err["cause"] || 500 ).json({
            message : "Catch Erorr" ,
            errorMsg : err.message
        })
    }
}