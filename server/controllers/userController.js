const ObjectId = require('mongoose').Types.ObjectId; //-------this is used to convert the ticketId in string to object Id _id For comparsion 
const user = require('../models/userModel.js');
const tickets = require('../models/ticketModel.js')

const jwt = require('jsonwebtoken');
const generateQR=require('../utility/generateQR.js')


// --------------------------------------------------Login---------------------------------------------------------------------
const login=async(req,res)=>{
     try{
        const {email,password}=req.body;
        
        const result=await user.findOne({email});
        if(!result){
            return res.status(400).json({message:'Invalid email or password'});
            }
            
            const isMatch=await result.isPasswordCorrect(password);
            if(!isMatch){
                return res.status(400).json({message:'Invalid email or password'});
                }
                const token=  jwt.sign({
                    id:result._id,
                    name:result.name,
                    email:result.email,
                },
                    process.env.JWT_SECRET
                )
                 res.cookie("token", token,{
                    httpOnly: false, // try this
                     sameSite: 'none',
                     secure: false,
                 })
              return res.status(200)
            //   .cookie('token',token,{
            //     httpOnly: false, // try this
            //     // secure: isSecure,
            //     })
              .json({message:"Logging",token});  
                
}
catch(err){
    console.log(err);
    res.status(500).json({message:'Internal server error'});
    
}
 }

//----------------------------------------------------------Register--------------------------------------------------------
const register=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        
        
        const userExist=await user.findOne({email});
        if(userExist){
            return res.status(400).json({message:'User Already Exist'});
            }
                const userCreate = await user.create({name,email,password});
                 await userCreate.save();
                 const token=  jwt.sign({
                    id:userCreate ._id,
                    name:userCreate .name,
                    email:userCreate.email,
                 },
                    process.env.JWT_SECRET
                 )
                
              return res.status(200)
            //   .cookie('token',token,{httpOnly:true,secure:true})
              .json({message:"user Created Successfully",token });  
                
}
catch(err){
    console.log(err);
    res.status(500).json({message:'Internal server error'});
    
}
}

//--------------------------------------------------Logout------------------------------------------------------
const logout = async(req,res)=>{
    try{
    res.clearCookie('token');
    return res.status(200).json({message:"user Logout successfully"})
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Internal server error'});
    }
}

//-----------------------------------------------Book-Ticket-------------------------------------------------------------------------
 const bookticket=async(req,res)=>{
   const {source,destination,price,routes}=req.body;
   routes.unshift(source); //-------set source as routes first element 
   
   const userId=req.userId;
   try{
    
    const ticket=await tickets.create({source,destination,price,user:userId,routes});
    await ticket.save()
     const userTicket=await user.findById({_id:userId});
    
       userTicket.ticket.push(ticket._id)
       await userTicket.save();
       
       const QR= await generateQR(ticket);  ///-----------pass value in array----------
       const addQR =await tickets.findOne({_id:ticket._id}) 
       addQR.QR= QR;
       await addQR.save()
    res.status(200).json({message:"Ticket Booked Successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:'Internal server error'});
        }
 }

//-----------------------------------------Ticket--List-----------------------------------------------
   const ticketList=async(req,res)=>{
    const userId=req.userId;
    try{
       const list = await tickets.find({user:userId}).sort({ updatedAt: -1})
    
       
       return res.status(200).json(list);
    }catch(err){
        console.log(err);
        return res.status(500).json({message:'Internal server error'});

    }
   }

//    ----------------------------------------Verfiy--Ticket--------------------------------------
     const verifyticket=async (req,res)=>{
        const {source,destination,ticketId,expAt}=  req.body;
        
        
        try{
          const verify= await tickets.findOne({_id:new ObjectId(ticketId)});
          
          if(!verify){
              return res.status(401).json({message:"Not a Valid Ticket ID"})
          }
          const expire= new Date(verify.expAt);
          const curr= new Date(expAt)
          
          if(expire.getTime() < curr.getTime()){
            return res.status(400).json({message:"Ticket Has Expired"})
          }
         const check = verify.routes.includes(source) && verify.routes.includes(destination) 
         if(!check){
             return res.status(401).json({message:"Destination is Invalid"})
         }
         return res.status(200).json({message:"Ticket is Verfied"})
        }catch(err){
            //console.log(err);
          return res.status(500).json({message:'Not a Valid Ticket ID'});
        }
     }

//----------------------------------------checking--UserToken------------------------------------------
const checktoken=async(req,res)=>{
    const userId=req.userId;
   
    
    try{
        const check = await user.findOne({_id:userId})
        if(!check){
            
            return res.status(401).json({message:"Invalid Token"}) ;
        }
        
      return res.status(200).json({message:"valid"}); 
     }catch(err){
         console.log("check auth",err);
         return res.status(500).json({message:'Internal server error'});
 
     }
}     

module.exports={
    login,
    register,
    logout,
    bookticket,
    ticketList,
    verifyticket,
    checktoken
}