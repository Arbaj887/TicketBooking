const mongodb = require("mongoose");


const ticketSchema = new mongodb.Schema(
  {
    source: {
      type: String,
      trim:true
    },
    destination: {
      type: String,
      trim:true
    },
    price: {
      type: Number,
      
      trim:true
    },
    routes:{
        type:Array,
        trim:true
    },
    expAt:{
      type:Date,
      default: ()=>new Date().getTime()+1*60*60*1000,
      
    },
    QR:{
      type:String,
    },
    user:{
      type : mongodb.Schema.Types.ObjectId,
      ref:"user"
  },
  
   
  },

  { timestamps: true }
);




const ticket = new mongodb.model('ticket', ticketSchema);
module.exports = ticket;
