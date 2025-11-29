import * as core from '@actions/core'
import { getContext, getOctokit } from './github.js'
import { run } from './run.js'

const main = async (): Promise<void> => {
  await run(
    {
      labelPrefix: core.getInput('label-prefix', { required: true }),
    },
    getOctokit(),
    getContext(),
  )
}

main().catch((e: Error) => {
  core.setFailed(e)
  console.error(e)
})
