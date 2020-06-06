const express = require('express');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const port = process.env.PORT || 3000;
const app = express();

const user = {
    username: "david",
    password: "123456"
}

passport.use(new LocalStrategy((username, password, done) => {
      
    if(username === user.username && password === user.password) {
            return done(null, user);
    }
     
    done(null, false);
}));

passport.serializeUser((user, done) => {
    const {username} = user; 
    done(null, {username});  
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

const userOK = (req, res, next) =>{
    if(req.isAuthenticated()) return next();
    res.redirect('/login');
}

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(session({
    name: 'sessionID', 
    secret: process.env.SECRET || 'alllpmkmk449##@@@@okoko',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
        httpOnly: true
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/domain', userOK, (req, res) => {
    const {username} = req.user;
    res.send(`Welcome ${username}, you just entered your account`);
});

app.route('/login')
.get((req, res) => {
    res.send(`
    <html>
    <form method="POST" action="/login">
        <input type="text" name="username" placeholder="Username">
        <input type="password" name="password" placeholder="Password">
        <input type="submit">
    </form>
</html>
    `);
})
.post(passport.authenticate('local',{
    failureRedirect: '/login',
    successRedirect: '/domain'
}));

app.listen(port, () => console.log(`Server ok ${port}`));

