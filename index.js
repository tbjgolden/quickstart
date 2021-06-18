const enquirer = require('enquirer')

const configMode = true

const confirm = async (q) => {
  return (await (enquirer.prompt([
    {
      type: 'confirm',
      message: q,
      name: '_'
    }
  ])))._;
}

const run = async () => {
  let installElvish = false

  if (configMode) {
    // Install elvish?
    installElvish = await confirm('Install elvish?');
  }

  console.log({ installElvish })

  if (installElvish) {
    console.log("Installing elvish...")
    console.log("Installed elvish")
  }
}

run()
