const express = require('express')
const router = express.Router()
const AuthUserMiddleware = require('../middlewares/AuthUserMiddleware')

const newTestSchema = require('../models/newTestSchema')


function generateSingleDigitRandomNumber() {
    // Generate a random number between 0 and 9 (inclusive)
    const randomNumber = Math.floor(Math.random() * 10);
    return randomNumber;
}


//making a commit

// Set up a function to add a new test every day at 4pm
async function addNewRepeatingTest(exptime, testtime) {
    // Getting the total tests with that category
    // const newtest = await newTestSchema.find()
    const newtest = await newTestSchema.find({ category: 'dailytest' })
    const suffix = newtest.length
    // const suffix = 70
    // console.log('all data', newtest)

    const randomNumber = generateSingleDigitRandomNumber();

    const testname = `dt${suffix}00-${randomNumber}`

    // Create a new instance of the NewTest model with the current date and time
    const newTest = new newTestSchema({
        testtitle: `daily test ${suffix}-${randomNumber}`,
        testname: testname,
        physics: '2',
        chemistry: '2',
        biology: '2',
        mat: '2',
        time: {
            type: 'timed',
            value: testtime,
            duration: '120',
            repeatafter: '1'
        },
        category: 'dailytest'
    });

    // Save the new test to the database
    newTest.save((err) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`New test added successfully with exp time ${exptime}`, newTest.testtitle);

            const removeNewRepeatingTest = setInterval(async () => {
                const newtest = await newTestSchema.findOne({ testname: testname })
                const archive = await newtest.changeCategoryValue()
                await newtest.save()

                console.log('removed', newtest.testtitle)

                clearInterval(removeNewRepeatingTest)

            }, exptime);

        }
    });


}

// addNewRepeatingTest(15000);
// addNewRepeatingTest(10000);
// addNewRepeatingTest(5000);
// Set up an interval to run the addNewTest function every day at 4pm
setInterval(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes()
    // console.log('running every 3 min')
    // console.log(hours,minutes)

//     if(hours===8 && minutes ===12){
//            addNewRepeatingTest(25200000,21);
//         } else if (hours===13 && minutes==00)
//     console.log('running every 3 min')
//     console.log(hours,minutes)

    if(hours===8 && minutes ===10){
           addNewRepeatingTest(25200000,17);
        } else if (hours===13 && minutes==5){
        addNewRepeatingTest(14400000,20);
    }
}, 60000); // Check every minute




// ADD NEW TESTS
router.post('/addnewtest', async (req, res) => {

    const { testtitle, testname, physics, chemistry, biology, mat, time, category } = req.body

    // VALIDATION
    if (!testtitle || !testname || !physics || !chemistry || !biology || !mat || !time || !category) {
        console.log("please fill completely")
        return res.status(400).send({
            message: 'one or more field is empty',
            status: 400
        }) //422 - client error
    }

    try {
        // const question = new Question({ qn, a, b, c, d, ans })
        const newtest = new newTestSchema({ testtitle, testname, physics, chemistry, biology, mat, time, category })
        const savenewtest = newtest.save()

        if (savenewtest) {
            res.status(200).json({
                message: 'new test added successfully',
                status: 200
            })

        } else {
            res.status(400).json({
                message: 'unable to send the test',
                status: 400
            })
        }

    } catch (error) {
        console.log('error in trycatch', error)
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

// ADD ATTENDED USERS AFTER THE TEST
router.post('/saveconnectedusers', async (req, res) => {
    try {

        const { id, username } = req.body

        const newtest = await newTestSchema.findOne({ _id: id })

        if (newtest) {
            // calling the ADDTEST method to send data to the user schema
            const attendeduser = await newtest.addConnectedUsers(username)
            await newtest.save() //save to newtest not usertest

            // res.status(201).json({msg:'sent successfully'})
            res.send({ users: newtest.usersconnected })
            // console.log('test data sent successfully')
        }

    } catch (error) {
        console.log(error)
    }
})

// GET THE TESTS IN FRONT END
router.get('/getnewtest', async (req, res) => {

    // console.log('auth tests')

    const tests = await newTestSchema.find()
    let newarray = [];
    // console.log(tests)
    tests.map((test) => {
        if (test.category !== 'archive') {
            // delete test.usersattended

            const newobj = {
                _id: test._id,
                testtitle: test.testtitle,
                testname: test.testname,
                physics: test.physics,
                chemistry: test.chemistry,
                biology: test.biology,
                mat: test.mat,
                time: test.time,
                category: test.category
            }
            newarray.push(newobj)
        } else {
            newarray.push(test)
        }
        // console.log(test.category)
    })

    res.send(newarray)


})
// GET THE TESTS IN FRONT END
router.get('/getarchivetest', async (req, res) => {
    try {
        const tests = await newTestSchema.find({ category: 'archive' })
        if (tests) {
            res.status(200).json({
                tests: tests,
                message: 'successfully fetched archive tests',
                status: 200
            })
        } else {
            res.status(400).json({
                message: 'Unable to fetch archive tests',
                status: 400
            })
        }

    } catch (error) {
        console.log('Error in trycatch', error)
    }
})

// GET THE TESTS IN FRONT END
router.get('/getdailytests', async (req, res) => {
    try {
        const tests = await newTestSchema.find({ category: 'dailytest' })
        if (tests) {
            res.status(200).json({
                tests: tests,
                message: 'successfully fetched Daily tests',
                status: 200
            })
        } else {
            res.status(400).json({
                message: 'Unable to fetch daily tests',
                status: 400
            })
        }

    } catch (error) {
        console.log('Error in trycatch', error)
    }
})

// SHOW OVERALL RESULT
router.post('/showoverallresult', AuthUserMiddleware, async (req, res) => {
    console.log('notes')

    const { testmode } = req.body

    const newtest = await newTestSchema.findOne({ testname: testmode })
    res.send(newtest.usersattended)

})




module.exports = router;
