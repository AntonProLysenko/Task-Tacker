const express  = require ('express')
const router = express.Router()
const Task = require('../models/Task')
// const token = require("../models/checkToken");
// const User = require ('../models/user')

// const checkToken = require ("../models/checkToken")

// let thisUser = require("./user")
// let currentUser


//CRUD

// GET
router.get ('/', (req,res)=>{
    Task.find({},(err, foundTasks)=>{
        if(!err){
                res.status(200).json(foundTasks);            
       
        }else{
            res.status(400).send(err)
        }
    
    })
});

//sorting tasks by the status
router.get('/table', (req,res)=>{    
  Task.find({},  (err, foundTasks) => {
    if (!err) { 

        // if (currentUser){
            if (currentUser.email === req.headers.requser) {
                foundTasks =  foundTasks.filter((task) => task.user === currentUser.email); //filtering data by the current user(asigning value in middleware) in backend                         
                const formatedData = foundTasks.reduce((accumulator, task) => {
                    //reduce will return an object instead array with props: status
                    accumulator[task.status] = accumulator[task.status]
                    ? [...accumulator[task.status], task]
                    : [task];
                    return accumulator; //always return acc in reduce func
                }, {}); //definig that it will be an obj;
                res.status(200).json(formatedData);
            }
            else{
                refetchReq = "Refetch"
                res.status(200).json(refetchReq);
            }

    } else {
      res.status(404).send(err);
    }
  });
})


//CREATE
router.post('/', (req,res)=>{
    const {body} = req

    Task.create(body, (err,createdTask)=>{
        if(!err){
            res.status(200).json({message: "Successfully Created!",
            createdTask: createdTask})
        }else{
            res.status(400).send(err)
        }
    })
})


//READ
router.get('/:id', (req,res)=>{

    console.log("show Page "+ currentUser.email);
    
    Task.findById(req.params.id, (err,foundTask)=>{
        if (foundTask&&(foundTask.user == currentUser.email)) {
          if (!err) {
            res.status(200).json(foundTask);
            //   getCurrentUser(null);
          } else {
            res.status(400).send({message:"Unexpected Error "});
          }
        } else if(!foundTask){
          res.status(404).send({message: "We Cound't Find It" });
        }else if(foundTask.user !== currentUser.email){
            res.status(403).send({ message: "Acces Denied" });
        }
    })
})

//UPDATE
router.put('/:id', (req,res)=>{
    const {body} = req

    Task.findByIdAndUpdate(req.params.id, body, {new:true}, (err,updatedTask)=>{
        if(!err){
            res.status(200).json(updatedTask)
        }else{
            res.status(400).send(err)
        }
    })
})





//DELETE
router.delete('/:id', (req,res)=>{
    Task.findByIdAndDelete(req.params.id, (err)=>{
        if(!err){
            res.status(200).send({message:"Successfully Deleted!"})
        }else{
            res.status(400).send(err)
        }
    })
})


// function getCurrentUser(user){
//    return currentUser = user
// }

module.exports = {router}
