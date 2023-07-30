const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const app = express()

app.use(bodyParser.urlencoded({extended:true}));
const sessLife = 1000 * 60 * 60 * 2  
app.use(session({
    cookie:{
        maxAge : sessLife,
        sameSite : true
    },
    secret: 'my_session_secret', 
    resave: false,
    saveUninitialized: true,
}));

// Dummy data
const users = [
    {name : 'Shabil', password : 'qwert'},
    {name : 'Afsal', password : 'qwert'},
    {name : 'Mubashir', password : 'qwert'}
]

// serving static files
app.use(express.static(path.join(__dirname,'public')));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');


// Middleware

const checkAuth = (req, res, next) => {
    if (req.session.isAuthenticated) {
      next();
    } else {
      res.redirect('/');
    }
};
// Routes
app.get('/',(req, res) => {
    if (req.session.isAuthenticated) {
        return res.redirect('/home')
    }
    return res.render('login');
})


app.post('/',(req, res) => {
    console.log(req.body)
    if(req.body.username && req.body.password){
        const user = users.find(user => user.name === req.body.username && user.password === req.body.password);
        console.log(user);
        if(user){
            req.session.isAuthenticated = true;
            req.session.userId = user.name;
            return res.redirect('/home')
        }
        return res.redirect('/')
    }else{
        res.render('/',{
            
        })
    }
    

})
app.get('/home',checkAuth,(req,res)=>{
   if(req.session.isAuthenticated){
    res.render('home')
   }
})
app.get('/logout',(req,res)=>{
    req.session.destroy();
        res.redirect('/');
})

app.get('/error',(req,res)=>{
    res.render('error')
})


app.listen(3000,()=>{
    console.log('Running');
})
