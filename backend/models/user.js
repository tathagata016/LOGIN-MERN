const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    password:{
     type:String,
     require:true,
    }
})

userSchema.pre('save',async function(next){
    const user=this
    //Hash the password if is modified (or it is new)
    if(!user.isModified('password')){
        return next();
        }
        try{
            //salt
            const salt =await bcrypt.genSalt(10);
            const hashedPassword=await bcrypt.hash(user.password,salt);
            user.password=hashedPassword;
            next();
        }catch(err){
            return next(err);
         }
})


userSchema.methods.comparePassword=async function (password) {
    try{
        const isMatch=await bcrypt.compare(password,this.password)
        return isMatch;
    }catch(err){
        throw err;
    }
    
}

const User=mongoose.model("User",userSchema)
module.exports=User;