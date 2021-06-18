const enquirer = require('enquirer')
const os = require('os')
const fs = require('fs-extra')
const path = require('path')
//
const { confirm, commandExists, install } = require('./utils')
//
global.OS = [os.platform(), os.arch()]

const run = async () => {
  try {
    await fs.ensureDir(path.join(__dirname, "tmp"))

    if (!(await commandExists("elvish"))) {
      console.log("Installing elvish...")
      await install('elvish')
      console.log("Installed elvish")
    }
  } catch (err) {
    console.error(err)
  }

  console.log("Cleaning up...")
  await fs.remove(path.join(__dirname, "tmp"))
  console.log("Done")
}

run()
