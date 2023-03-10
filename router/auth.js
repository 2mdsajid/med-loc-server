const express = require('express')
const router = express.Router()
let app = express()
const Status = require('../models/StatusModel')

// .. --> bcoz its inside a folder
// to define thw QUESTION schema and SAVE it in db
const Question = require('../models/question')
const Physics = require('../models/physics')
const Chemistry = require('../models/chemistry')
const Biology = require('../models/biology')
const TestUser = require('../models/testuser')
const Mat = require('../models/mat')

const notesSchema = require('../models/notesSchema')



// image schema
const ImageModel = require('../models/imageschema')


/* MULTER  */
const multer = require('multer')
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra')

const DIR = './public/';

const setDirectory = (floc) => {

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            // console.log(floc)
            cb(null, DIR + 'mat/');
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    });

    return multer({
        storage: storage,
        fileFilter: (req, file, cb) => {
            if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
            }
        }
    });
}

const upload = setDirectory('mat/')

const addQuestion = async (qn, a, b, c, d, ans, chap, category, img) => {
    if (category == 'p') {
        const physics = new Physics({ qn, a, b, c, d, ans, chap, img })
        return await physics.save()
    } else if (category == 'c') {
        const chemistry = new Chemistry({ qn, a, b, c, d, ans, chap, img })
        return await chemistry.save()
    } else if (category == 'b') {
        const biology = new Biology({ qn, a, b, c, d, ans, chap, img })
        return await biology.save()
    } else if (category == 'm') {
        const mat = new Mat({ qn, a, b, c, d, ans, chap, img })
        return await mat.save()
    }
}


router.post('/addqnwithimage', upload.single('avatar'), async function (req, res, next) {

    const { qn, a, b, c, d, ans, chap, category } = req.body;
    if (!qn || !a || !b || !c || !d || !ans || !chap || !category) {
        // console.log("Please fill completely");
        return res.status(400).send({
            message: 'one or more field incomplete',
            status: 400
        }); //422 - client error
    }

    const hostUrl = `${req.protocol}://${req.get('host')}`;
    const dest = category;
    const newDir = `${DIR}${dest}/`;

    try {

        // CHECK IF DIRECTORY EXIST AND CREATE A NEW ONE IF NOT EXIST
        await fse.ensureDir(newDir);

        const ext = req.file.mimetype.split('/')[1];
        const fileName = `${dest}${fs.readdirSync(newDir).length}.${ext}`;
        const origDest = `${DIR}mat/${req.file.filename}`;
        const newDest = `${newDir}${fileName}`;

        // SETTING UL FOR DATABASE
        const img = `${hostUrl}${DIR.slice(1)}${dest}/${fileName}`;
        console.log(img)

        // MOVE THE PATH FROM TEST DIRECTORY TO A NEW ONE
        await fse.move(origDest, newDest);

        const saveQn = await addQuestion(qn, a, b, c, d, ans, chap, category, img)

        if (saveQn) {
            res.status(200).json({
                message: `${category} sent successfully with image`,
                status: 200
            })

        } else {
            res.status(400).json({
                message: `${category} sent successfully with image`,
                status: 400
            })
        }

    } catch (error) {
        console.log('error in trycatch ', error)
    }
})

router.post('/addquestion', async (req, res) => {

    const { qn, a, b, c, d, ans, chap, category } = req.body

    // VALIDATION
    if (!qn || !a || !b || !c || !d || !ans || !chap || !category) {
        console.log("please fill completely")
        return res.status(422).send("please fill completely") //422 - client error
    }

    try {
        // const question = new Question({ qn, a, b, c, d, ans })
        const saveQn = addQuestion(qn, a, b, c, d, ans, chap, category,'')

        if (saveQn) {
            res.status(200).json({
                message: `${category} sent successfully withour image`,
                satus: 200
            })
            
        } else {
            res.status(400).json({
                message: `${category} can't be sent without image`,
                status: 400
            })
    
        }

    } catch (error) {
        console.log(error)
    }
})

/* SAVE NOTES TO DATABASE */
router.post('/savenote', upload.array('note', 15), async function (req, res, next) {

    // const { qn, a, b, c, d, ans } = req.body;
    // if (!qn || !a || !b || !c || !d || !ans) {
    //     console.log("Please fill completely");
    //     return res.status(422).send("Please fill completely"); //422 - client error
    // }

    let contents = [] //to store the URLs
    let dbObj = {} //to store the JSON data format
    let rooturl = []

    const files = req.files
    const notetitle = req.body.notetitle
    const notecategory = req.body.notecategory
    const noteimgname = req.body.noteimgname
    const notecontent = req.body.notecontent
    const noteintro = req.body.noteintro

    const hostUrl = `${req.protocol}://${req.get('host')}`;
    const dest = 'notes';
    const newDir = `${DIR}${dest}/`;

    try {

        // CHECK IF DIRECTORY EXIST AND CREATE A NEW ONE IF NOT EXIST
        await fse.ensureDir(newDir);
        const content = await Promise.all(req.files.map(async (file, index) => {

            const randomNumber = Math.floor(Math.random() * 20);
            const ext = file.mimetype.split('/')[1];
            const fileName = `${noteimgname}${index + 1}.${ext}`;
            const origDest = `${DIR}mat/${file.filename}`;
            const newDest = `${newDir}${fileName}`;

            // MOVE THE PATH FROM TEST DIRECTORY TO A NEW ONE
            await fse.move(origDest, newDest);

            // SETTING UL FOR DATABASE
            const rootUrl = `${hostUrl}${DIR.slice(1)}${dest}/`
            const imgUrl = `${rootUrl}${fileName}`;

            contents.push(imgUrl)
            dbObj.rooturl = rootUrl
            rooturl.push(rootUrl)
            return rootUrl;

        }
        ));

        dbObj.name = noteimgname
        dbObj.text = notecontent
        dbObj.imgs = contents
        dbObj.title = notetitle
        dbObj.intro = noteintro


        // res.send({'content':dbObj})

        const newnote = new notesSchema({
            title: notetitle,
            category: notecategory,
            imgname: noteimgname,
            notecontent: notecontent,
            imgurl: contents,
            rooturl: rooturl[0],
            intro: noteintro
        })

        const saveNote = await newnote.save()



        //     const mat = new Mat({ qn, a, b, c, d, ans, img })
        //     const matSave = await mat.save()

        if (saveNote) {
            res.status(201).json({ msg: `note ${notetitle} sent successfully` })
            console.log(saveNote)
        } else {
            res.status(500).json({ msg: `note ${notetitle} sent successfully` })
            console.log("sent not successfully")
        }

    } catch (error) {
        console.log(error)
    }
})


/* GET NOTES FROM THE DATABASE */
router.get('/getnotes', (req, res) => {
    // console.log('notes')

    notesSchema.find({}, function (err, array) { //exclude 3
        res.send(array)
        // console.log('notes')
    })
})



// setting a route to home
router.get('/', (req, res) => {
    res.send('this is home page router')
    // console.log('this is home page router');
})


// MAT QUESTION
router.post('/addmatquestion', async (req, res) => {

    const { qn, a, b, c, d, ans, } = req.body

    // VALIDATION
    if (!qn || !a || !b || !c || !d || !ans || !category) {
        console.log("please fill completely")
        return res.status(422).send("please fill completely") //422 - client error
    }

    try {
        // const question = new Question({ qn, a, b, c, d, ans })
        const saveQn = addQuestion(qn, a, b, c, d, ans, category)

        if (saveQn) {
            res.status(201).json(' sent successfully')
            console.log("sent successfully")
        } else {
            res.status(500).json('failed')
            console.log("sent not successfully")
        }

    } catch (error) {
        console.log(error)
    }

})



//will not show in local host bcoz it is POST not GET
// SEND QUESTIONS INTO THE DATABASE


// SAVING TEST-USER DATA INTO DB
router.post('/saveuser', async (req, res) => {
    try {

        const { username, userlevel, testmode, totalscore, totalwrong, totaltimetaken } = req.body

        const testuser = new TestUser({ username, userlevel, testmode, totalscore, totalwrong, totaltimetaken })
        const savetestuser = await testuser.save()

        if (savetestuser) {
            res.status(201).json('test user sent successfully')
            console.log("test user sent successfully")
        } else {
            res.status(500).json('test user sent failed')
            console.log("test user sent not successfully")
        }

    } catch (error) {
        console.log(error)
    }
})

// GET QUESTIONS BASD ON SUBJECT
router.post('/getbiologyquestion', (req, res) => {
    const { biology } = req.body

    console.log('auth', biology)

    if (!biology) {
        console.log("please fill completely")
        return res.status(422).send("please fill completely") //422 - client error
    }
    const bNum = parseInt(biology)

    Biology.find({}, function (err, questions) {
        array = questions.slice(0, bNum) //exclude 3
        res.send(array)

    })
})



router.post('/getallquestion', async (req, res) => {
    const { physics, chemistry, biology, mat } = req.body

    if (!physics || !chemistry || !biology || !mat) {
        console.log("please fill completely")
        return res.status(422).send("please fill completely") //422 - client error
    }

    try {
        const pNum = parseInt(physics)
        const cNum = parseInt(chemistry)
        const bNum = parseInt(biology)
        const mNum = parseInt(mat)

        const phy = await Physics.find()
        const bio = await Biology.find()
        const chem = await Chemistry.find()
        const matqn = await Mat.find()

        res.status(402).json({
            phy: phy.slice(0, pNum),
            bio: bio.slice(0, bNum),
            chem: chem.slice(0, cNum),
            mat: matqn.slice(0, mNum)
        })

    } catch (error) {
        console.log('error in allquestion', error)
    }

})

router.post('/getphysicsquestion', (req, res) => {
    const { physics } = req.body

    if (!physics) {
        console.log("please fill completely")
        return res.status(422).send("please fill completely") //422 - client error
    }
    const pNum = parseInt(physics)

    Physics.find({}, function (err, questions) {
        array = questions.slice(0, pNum) //exclude 3
        res.send(array)

    })
})

router.post('/getchemistryquestion', (req, res) => {
    const { chemistry } = req.body

    if (!chemistry) {
        console.log("please fill completely")
        return res.status(422).send("please fill completely") //422 - client error
    }
    const bNum = parseInt(chemistry)

    Chemistry.find({}, function (err, questions) {
        array = questions.slice(0, bNum) //exclude 3
        res.send(array)
    })
})

router.post('/getmatquestion', (req, res) => {
    const { mat } = req.body

    if (!mat) {
        console.log("please fill completely")
        return res.status(422).send("please fill completely") //422 - client error
    }
    const bNum = parseInt(mat)

    Mat.find({}, function (err, questions) {
        array = questions.slice(0, bNum) //exclude 3
        res.send(array)
    })
})


// USING PARAMS IN THE URL
router.get('/usingparam/:id', (req, res) => {
    const { id } = req.params
    res.send(id)
})

router.get('/addvisitors',async(req,res)=>{

    const status = new Status({
        visitors: 0,
        newvisitors: 0,
        liveconnected: []
    })
    
    status.save()

    // const status = await Status.find()
    // const visitors = await newtest.addVisitor()
    // status.save()

    // res.status(200).json({
    //     message:'added visitor',
    //     status:200
    // })

})


module.exports = router;