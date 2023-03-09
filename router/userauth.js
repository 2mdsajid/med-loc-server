const express = require('express')
const router = express.Router()

const AuthUserMiddleware = require('../middlewares/AuthUserMiddleware')

const Cookies = require('cookies')

const User = require('../models/user')

// USER SIGNUP
router.post('/usersignup', async (req, res) => {
    try {

        const { username, email, password } = req.body

        // VALIDATION
        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'credentials required',
                status: 400
            })
        }

        const user = new User({ username, email, password })
        const saveuser = await user.save()

        if (saveuser) {

            usertoken = await saveuser.GenerateAuthToken()

            res.status(200).json({ 
                'usertoken': usertoken,
                message : 'successfully signed up',
                status: 200
             })
            // console.log("user sent successfully", usertoken)
        } else {
            res.status(400).json({
                message:'Unable to signup',
                status:400
            })
            // console.log("user sent not successfully")
        }
        
    } catch (error) {
        console.log('error in trycatch', error);
        // console.log(error)
    }
})

// ADDING THE TESTS DATA TO THE USER AFTER TESTS
router.post('/addtestdata', AuthUserMiddleware, async (req, res) => {
    try {

        const { logintoken, testmode, testtitle, totalscore, totalwrong, unattempt, totaltimetaken, questions } = req.body

        //  req.id == _id (for db) 
        // coming from the AuthUserMiddleware
        const user = await User.findOne({ _id: req.id })

        if (user) {
            // calling the ADDTEST method to send data to the user schema
            const usertest = await user.addTest(testmode, testtitle, totalscore, totalwrong, unattempt, totaltimetaken, questions)
            await user.save() //save to user not usertest

            res.status(201).json(usertest)
            console.log('test data sent successfully')
        }

    } catch (error) {
        console.log(error)
    }
})

// USER PROFILE
router.post('/userprofile', AuthUserMiddleware, (req, res) => {
    
    
    
    try {
        const verifieduser = req.verifieduser
        // console.log('verified user in node userprofile',verifieduser)
        
        const newuser = {
            id: verifieduser._id,
            username: verifieduser.username,
            email: verifieduser.email,
            date: verifieduser.date,
            tests: verifieduser.tests
        }

        res.status(200).json({
            userdata:newuser,
            status:200
        })
        
    } catch (error) {
        // console.log(error)
        console.log('error in trycatch', error);
    }

})

// USER LOGIN
router.post('/userlogin', async (req, res) => {

    var Cookie = new Cookies(req, res)

    try {
        let token;

        const { email, password } = req.body

        // VALIDATION
        if (!email || !password) {
            return res.status(400).json({
                message: 'username or password required',
                status: 400
            })
        }

        const userindb = await User.findOne({ email: email })

        if (userindb) {

            /* MATCHING HASHED PASSWORD FOR LOGIN */
            // const isMatch = await bcrypt.compare(password, userLogin.password)

            if (userindb.password === password) {

                /* GENERATING JWT TOKEN */
                logintoken = await userindb.GenerateAuthToken()
                // console.log(userindb);



                /* ATORING JWT TOKEN IN COOKIES */
                // Cookie.set('logintoken', logintoken, { expires: new Date(Date.now() + 6000000) });
                // res.cookie("logintoken", logintoken, {
                //     expires:new Date(Date.now()+500000),
                //     httpOnly:true
                // })

                const newuser = {
                    id: userindb._id,
                    username: userindb.username,
                    email: userindb.email,
                    date: userindb.date,
                    tests: userindb.tests
                }

                res.json({ user: newuser, logintoken: logintoken })

            } else {
                // console.log('')
                res.status(400).json({
                    message: "invalid credentials",
                    status: 400
                })
            }
        } else {
            res.status(400).json({
                message: "invalid credentials",
                status: 400
            })
        }
    } catch (error) {
        console.log('error in trycatch', error);
    }

})

// REMOVE TOKEN TO LOG OUT
router.get('/logout', (req, res) => {
    res.clearCookie('logintoken')
    res.redirect('/')
})

// CHECK IF USER LOGGED IN OR NOT
router.get('/checkloggedin', AuthUserMiddleware, (req, res) => {
    res.send(req.id)
})

// SHOW USER PROFILE
// router.get('/userprofile', AuthUserMiddleware, (req, res) => {
//     res.send(req.verifieduser)
// })



// GET USERNAME ||| if logged in
router.post('/getusername', AuthUserMiddleware, (req, res) => {
    res.send({ username: req.username })
})



module.exports = router;