const express = require('express')
const utils = require('./utils/utils')
const fs = require('fs')

const app = express()

app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get("/", (req, res) => {
    utils.initDockerImage().then(containerId => {
        // console.log(`id: ${containerId}`)
        return res.redirect(`/playground?id=${containerId}`)
    }).catch(err => {
        console.log(`exec error: ${err}`)
        return res.json({ msg: err })
    })
})


app.get("/playground", (req, res) => {
    const containerId = req.query.id
    const output = req.query.output
    console.log(req.query)
    res.render("playground", { containerId, output })
})


app.post("/playground", (req, res) => {
    const userCode = req.body.code
    const containerId = req.query.id

    utils.writeToFile(userCode, "./code/main.py").then(() => {

        utils.runPythonCode(containerId, "main.py").then(output => {
            utils.writeToFile(output, "./output/output.txt")
            return res.redirect(`/playground?id=${containerId}&output=${output}`)
        })

    }).catch(error => {
        console.log(error)
    })
})


app.listen(3000, () => {
    console.log("Listening on port 3000...")
})