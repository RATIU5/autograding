import * as core from '@actions/core'
import fs from 'fs'
import path from 'path'
import {Test, runAll} from './runner'

const run = async (): Promise<void> => {
  try {
    const cwd = process.env['GITHUB_WORKSPACE']
    if (!cwd) {
      throw new Error('No GITHUB_WORKSPACE')
    }

    const data = fs.readFileSync(path.resolve(cwd, '.github/classroom/autograding.json'))
    const json = JSON.parse(data.toString())

    await runAll(json.tests as Array<Test>, cwd)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error('An unknown error occurred')
    }
    core.setFailed(`Autograding failure: ${error}`)
    // If there is any error we'll fail the action with the error message
  }
}

// Don't auto-execute in the test environment
if (process.env['NODE_ENV'] !== 'test') {
  run()
}

export default run
