const fs = require('fs-extra');
const download = require('download');

const { installBinary, getLatestMatchingUrl } = require("./utils")

module.exports = async () => {
  const platform = ({
    darwin: "apple-darwin",
    linux: "unknown-linux-gnu"
  })[global.OS[0]]
  const arch = ({
    arm64: "aarch64",
    x64: "x86_64"
  })[global.OS[1]]

  const downloadFrag = `${arch}-${platform}`

  const VALID_ARCHS = new Set([
    "aarch64-apple-darwin",
    "x86_64-apple-darwin",
    "aarch64-unknown-linux-gnu",
    "x86_64-unknown-linux-gnu"
  ])

  if (VALID_ARCHS.has(downloadFrag)) {
    const url = await getLatestMatchingUrl(
      'starship/starship',
      downloadFrag
    )
    await download(url, 'tmp', {
      extract: true
    });
    await installBinary("starship", 'starship')
  } else {
    throw new Error("Invalid platform/arch")
  }
}
