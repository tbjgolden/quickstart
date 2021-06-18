const fs = require('fs');
const download = require('download');

module.exports = async () => {
  const platform = ({
    darwin: "darwin",
    linux: "linux"
  })[global.OS[0]]
  const arch = ({
    arm64: "arm64",
    x64: "amd64"
  })[global.OS[1]]

  const downloadFrag = `${platform}-${arch}`

  const VALID_ARCHS = new Set([
    "darwin-arm64",
    "darwin-amd64",
    "linux-arm64",
    "linux-amd64"
  ])

  if (VALID_ARCHS.has(downloadFrag)) {
    // await download(`https://dl.elv.sh/${downloadFrag}/elvish-HEAD.tar.gz`, 'test', {
    //   extract: true
    // });
    // fs.writeFileSync('dist/foo.jpg', await download('http://unicorn.com/foo.jpg'));
    // download('unicorn.com/foo.jpg').pipe(fs.createWriteStream('dist/foo.jpg'));

    await new Promise((resolve) => setTimeout(resolve, 1000))
  } else {
    throw new Error("Invalid platform/arch")
  }
}
