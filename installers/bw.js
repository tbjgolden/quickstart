const fs = require('fs-extra');
const path = require('path');
const download = require('download');

const { installBinary } = require("./utils")

module.exports = async () => {
  await installBinary(
    path.join(__dirname, "..", "static", "bw"),
    "bw"
  )
}
