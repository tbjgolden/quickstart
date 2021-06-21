const fs = require('fs-extra');
const download = require('download');

const { installLib, installMacApp, getLatestMatchingUrl } = require("./utils")

module.exports = async () => {
  const platform = ({
    darwin: "darwin",
    linux: "linux"
  })[global.OS[0]]
  const arch = ({
    arm64: "arm64",
    x64: "x64"
  })[global.OS[1]]

  const downloadFrag = `${platform}-${arch}`

  const VALID_ARCHS = new Set([
    "darwin-x64",
    "darwin-arm64",
    "linux-x64",
    "linux-arm64"
  ])

  if (VALID_ARCHS.has(downloadFrag)) {
    let url = null
    try { 
      await getLatestMatchingUrl(
        'VSCodium/vscodium',
        `VSCodium-${downloadFrag}`
      )
    } catch (err) {}

    if (url === null) {
      if (downloadFrag === "darwin-arm64") {
        url = await getLatestMatchingUrl(
          'VSCodium/vscodium',
          'VSCodium-darwin-x64'
        )
      } else {
        throw new Error("Invalid platform/arch")
      }
    }

    if (global.OS[0] === "darwin") {
      await download(url, 'tmp', {
        extract: true
      });
      await installMacApp("VSCodium.app")
    } else {
      await download(url, 'tmp/codium', {
        extract: true
      });
      await installLib("codium")
    }
  } else {
    throw new Error("Invalid platform/arch")
  }
}
