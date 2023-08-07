import express from "express"; // requiring express, 
// const port = 8000; 
const app = express(); 
const port = process.env.PORT; 
// requiring express-ejs-layout, it will help in rendering the page.
import expressLayout from 'express-ejs-layouts';

// requring DataBase
import db from './config/mongoose';

import { urlencoded } from 'body-parser';

// Creating session
import session from 'express-session';
import { initialize, session as _session, setAuthenticatedUser } from 'passport';
import passportLocal from './config/passport-local';

// requiring mongo-store, so that we can use the existing user even after server start
import { create } from 'connect-mongo';

// they are used for showing action notifications
import flash from 'connect-flash'; 
import { setFlash } from './config/flashMiddleware';

// For getting the output from req.body(it will parse the upcoming request to String or Arrays).
app.use(urlencoded({extended:false}));
// For using the file in assets folder.
app.use(express.static('./assets'));

// Setting up the view engine
app.set('view engine','ejs');
app.set('views','./views');

app.use(expressLayout);

// mongo store is used to store the session cookie in the db 
app.use(session({
    name: "ERS",
    // change secret during before deployment in production 
    secret: "employeeReviewSystem",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: create({
        mongoUrl: 'mongodb+srv://tushargupta24042002:Tushar24042002@cluster0.xoo7rki.mongodb.net/employemnt?retryWrites=true&w=majority',
        autoRemove: 'disabled'
    },
        (err) => {
            console.log(err || 'connect-mongo setup ok');
        }
    )
}))

// Using passport
app.use(initialize());
app.use(_session());
app.use(setAuthenticatedUser);

// Using Connect flash
app.use(flash());
app.use(setFlash);

// setting up the router, following MVC structure.
app.use('/' , require('./routes/index'));


// Setting up the server at the given port
app.listen(port, function(err){
    if(err){
        console.log("Error in running the app.");
        return ;
    }
    console.log("Server is up and running at port ", + port);
});
