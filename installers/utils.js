const path = require('path')
const fs = require('fs-extra')
const fetch = require('isomorphic-unfetch')
const os = require('os')
const { exec } = require('child_process')

const installBinary = async (sourcePath, name) => {
  await fs.remove(
    path.join(__dirname, '..', 'bin', name)
  )

  await fs.copy(
    path.resolve(__dirname, '..', 'tmp', sourcePath),
    path.join(__dirname, '..', 'bin', name)
  )
}

const installLib = async (sourcePath) => {
  const packageRoot = path.resolve(__dirname, '..', 'tmp', sourcePath)
  const packageBin = path.resolve(packageRoot, 'bin')
  const files = await fs.readdir(packageBin)
  const executables = (await Promise.all(
      files.map(async file => {
        const lstat = await fs.lstat(path.join(packageBin, file))
        const isExecutable = (lstat.mode % 4096).toString(8).split("").every(n => n === "5" || n === "7")
        const isFile = lstat.isFile()
        return isExecutable && isFile ? file : null
      })
    )).filter(Boolean)

  if (executables.length > 0) {
    const packageDirName = path.basename(packageRoot)
    const packageDirPath = path.join(__dirname, '..', 'lib', packageDirName)

    try { await fs.remove(packageDirPath) } catch (err) {}
    await fs.move(
      packageRoot,
      packageDirPath
    )

    for (const executable of executables) {
      const symlinkPath = path.join(__dirname, '..', 'bin', executable)
      try { await fs.unlink(symlinkPath) } catch (err) {}
      await fs.symlink(
        path.join(packageDirPath, 'bin', executable),
        symlinkPath
      )
    }
  }
}

const installMacApp = async (sourcePath) => {
  const packageRoot = path.resolve(__dirname, '..', 'tmp', sourcePath)
  const appName = path.basename(packageRoot)

  const localAppsDirPath = path.join(
    os.homedir(),
    'Applications'
  )
  await fs.ensureDir(localAppsDirPath)
  const appDirPath = path.join(
    localAppsDirPath,
    appName
  )
  await fs.remove(appDirPath)
  await fs.move(packageRoot, appDirPath)
  await new Promise((resolve, reject) => {
    exec(`xattr -r -d com.apple.quarantine "${appDirPath}"`, (err, stdout, stderr) => {
      if (err) {
        return reject(err)
      } else {
        return resolve()
      }
    })
  })
}

const getLatestMatchingUrl = async (repo, fileName) => {
  const res = await fetch(`https://api.github.com/repos/${repo}/releases`)
  const releases = await res.json()

  const matchingUrl = (
    releases.map(({ assets }) => {
      return (assets.map(({ name, browser_download_url }) => ({
        name,
        browser_download_url
      })).find(({ name, browser_download_url }) => {
        return name.includes("sha256") ? false : (name.includes(fileName));
      }) || {}).browser_download_url || null
    }).find(Boolean)
  ) || null

  if (matchingUrl === null) {
    throw new Error(`Could not find download matching "${fileName}" in "${repo}"`)
  }

  return matchingUrl
}

module.exports = {
  installBinary,
  installLib,
  installMacApp,
  getLatestMatchingUrl
}
