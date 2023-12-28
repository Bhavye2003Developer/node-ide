const fs = require('fs')
// const util = require('node:util');
// const exec = util.promisify(require('node:child_process').exec);
const { exec } = require('node:child_process')

async function writeToFile(code, fileNmae) {
    return /** @type {Promise<void>} */(new Promise((resolve, reject) => {
        fs.writeFile(`${fileNmae}`, code, (err) => {
            if (err) {
                reject(`error: ${err}`)
                return
            }
            else {
                console.log(`written file successfully -> ${fileNmae}`)
                resolve()
                return
            }
        })
    }))
}


async function initDockerImage() {
    const command = "docker run -dtp 127.0.0.1:3000:3000 code-runner bash"

    // initialise container and return id
    return executeCommand(command)
}



async function runPythonCode(containerId, fileNmae) {
    // copy file to docker container and get it's output
    const command = `docker cp code/${fileNmae} ${containerId}:/code && docker exec ${containerId} /bin/bash -c "python3 ${fileNmae} 2>&1 | tee output.txt"`
    return executeCommand(command)
}

/**
 * @param {string} command
 */
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error)
                return;
            }
            resolve(stdout)
            // console.error(`stderr: ${stderr}`);
        });
    });
}




module.exports = { writeToFile, initDockerImage, runPythonCode }