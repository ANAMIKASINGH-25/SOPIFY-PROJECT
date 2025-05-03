require('dotenv').config();
const express = require('express');
const UserRouter = require('./routers/userRouter');
const SopRouter =require('./routers/sopRouter');
const ReviewRouter =require('./routers/reviewRouter');
const FeedbackRouter =require('./routers/feedbackRouter');
const cors=require('cors');

const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(cors({origin:"*"}))
app.use(express.json());
app.use('/user', UserRouter);
app.use('/sops',SopRouter);
app.use('/review',ReviewRouter);
app.use('/feedback',FeedbackRouter);

//endpoint or route

app.get('/',(req,res) => {
    res.send('response from rxpress');
});

app.get('/add',(req,res) =>{
    res.send('response from add');
});

//getall
app.get('/getall',(req,res)=>{
    res.send('response from getall');
});

//delete
app.get('/delete',(req,res)=>{
    res.send('response from delete');
});

app.listen(port, () => {
    console.log('server started');
});
