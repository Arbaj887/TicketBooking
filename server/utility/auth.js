const jwt =require('jsonwebtoken');

const auth = async (req,res,next)=>{
   
   //console.log(req.header("Authorization"))
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    
    try{
    if(!token){
       
        return res.status(401).json({message:"Unauthorized 1 Access"});

    }
    
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
           
          
           return res.status(401).json({message:"Unauthorized  Accessed"})
        }
       
        req.userId=decoded?.id
        
        next();
    });
 
    
    }catch(err){
        console.log("Auth error",err)
    }    

}

module.exports = auth;