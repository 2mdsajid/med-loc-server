const express = require('express')
const router = express.Router()
const AuthUserMiddleware = require('../middlewares/AuthUserMiddleware')

const newTestSchema = require('../models/newTestSchema')

// Set up a function to add a new test every day at 4pm
async function addNewRepeatingTest() {
    // Getting the total tests with that category
    // const newtest = await newTestSchema.find()
    const newtest = await newTestSchema.find({ category: 'weeklytest' })
    const suffix =  newtest.length
    console.log('all data',newtest)

    const testname = `dt${suffix}`

    // Create a new instance of the NewTest model with the current date and time
    const newTest = new newTestSchema({
        testtitle: `weekly test ${suffix}`,
        testname: testname,
        physics: '2',
        chemistry: '2',
        biology: '2',
        mat: '2',
        time: {
            type:'timed',
            value:'1',
            duration:'0',
            repeatafter:'1'
        },
        category: 'weeklytest'
    });

    // Save the new test to the database
    newTest.save((err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('New test added successfully',newTest.testname);
        }
    });


    const removeNewRepeatingTest = setInterval(async () => {
        const newtest = await newTestSchema.findOne({ testname: testname })
        const archive = await newtest.changeCategoryValue()
        await newtest.save()

        console.log(newtest)

    }, 240000);


}

// addNewRepeatingTest();
// Set up an interval to run the addNewTest function every day at 4pm
setInterval(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    // if (hours === 1 && minutes === 27) {
    //     addNewRepeatingTest();
    // }


}, 10000); // Check every minute




// ADD NEW TESTS
router.post('/addnewtest', async (req, res) => {

    const { testtitle, testname, physics, chemistry, biology, mat, time, category } = req.body

    // VALIDATION
    if (!testtitle || !testname || !physics || !chemistry || !biology || !mat || !time || !category) {
        console.log("please fill completely")
        return res.status(422).send("please fill completely") //422 - client error
    }

    try {
        // const question = new Question({ qn, a, b, c, d, ans })
        const newtest = new newTestSchema({ testtitle, testname, physics, chemistry, biology, mat, time, category })
        const savenewtest = newtest.save()

        if (savenewtest) {
            res.status(201).json('test sent successfully')
            console.log("test sent successfully")
        } else {
            res.status(500).json('failed')
            console.log("test sent not successfully")
        }

    } catch (error) {
        console.log(error)
    }

})


// ADD ATTENDED USERS AFTER THE TEST
router.post('/saveusertotest', async (req, res) => {
    try {

        const { id, username, totalscore } = req.body

        // const user = new User({ username, email, password })
        // const saveuser = await user.save()

        const newtest = await newTestSchema.findOne({ _id: id })

        if (newtest) {
            // calling the ADDTEST method to send data to the user schema
            const attendeduser = await newtest.addAttendedUsers(username, totalscore)
            await newtest.save() //save to newtest not usertest

            // res.status(201).json({msg:'sent successfully'})
            res.send({ users: newtest.usersattended })
            // console.log('test data sent successfully')
        }

    } catch (error) {
        console.log(error)
    }
})

// GET THE TESTS IN FRONT END
router.get('/getnewtest', async (req, res) => {
    // console.log('notes')

    newTestSchema.find({}, async function (err, array) { //exclude 3

        let newarray = [];

        await array.map((arr) => {

            // REMOVING THE ATTENDED-USERS FROM THE TEST DATA
            const newobj = {
                _id: arr._id,
                testtitle: arr.testtitle,
                testname: arr.testname,
                physics: arr.physics,
                chemistry: arr.chemistry,
                biology: arr.biology,
                mat: arr.mat,
                time: arr.time,
                category: arr.category
            }
            newarray.push(newobj)
        })
        res.send(newarray)
        // console.log('notes')
    })

})

// SHOW OVERALL RESULT
router.post('/showoverallresult', AuthUserMiddleware, async (req, res) => {
    console.log('notes')

    const { testmode } = req.body

    const newtest = await newTestSchema.findOne({ testname: testmode })
    res.send(newtest.usersattended)

})




module.exports = router;