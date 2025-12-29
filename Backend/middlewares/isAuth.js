import jwt from "jsonwebtoken"
//finds the tokens in cookies using userid or jwt secret
const isAuth=async(req,res,next)=>{
        const token=req.cookies.token
        if(!token)
        {
            return res.status(400).json({message:"Token not found"})
        }
        try
        {
        const decode = jwt.verify(token,process.env.JWT_SECRET)
        req.userId=decode.userId

        next()


    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"is Auth error"})
    }
}

export default isAuth
