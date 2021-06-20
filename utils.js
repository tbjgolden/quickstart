const enquirer = require('enquirer')
const _commandExists = require('command-exists');

const commandExists = (cmd) => new Promise((resolve, reject) => {
  _commandExists(cmd, function(err, exists) {
    if (err) return reject(err);
    return resolve(exists);
  });
})

const confirm = async (q) => {
  return (await (enquirer.prompt([
    {
      type: 'confirm',
      message: q,
      name: '_'
    }
  ])))._;
}

const install = async (program) => {
  console.log(`Installing ${program}...`)
  await (require(`./installers/${program}`)())
  console.log(`Installed ${program}`)
}

module.exports = {
  confirm,
  commandExists,
  install
}
