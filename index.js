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
    try { await fs.remove(path.join(__dirname, "tmp")) } catch (err) {}
    await fs.ensureDir(path.join(__dirname, "tmp"))
    // if (!(await commandExists("elvish"))) {
    //   await install('elvish')
    // }
    // if (!(await commandExists("starship"))) {
    //   await install('starship')
    // }
    // if (!(await commandExists("bw"))) {
    //   await install('bw')
    // }
    if (!(await commandExists("codium"))) {
      await install('codium')
    }

  } catch (err) {
    console.error(err)
  }

  console.log("Cleaning up...")
  // await fs.remove(path.join(__dirname, "tmp"))
  console.log("Done")
}

run()
