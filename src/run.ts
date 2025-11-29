import * as core from '@actions/core'
import type { Octokit } from '@octokit/action'
import type { Context } from './github.js'
import { computePullRequestGroups } from './group.js'
import { reconcile } from './reconcile.js'

type Inputs = {
  labelPrefix: string
}

export const run = async (inputs: Inputs, octokit: Octokit, context: Context): Promise<void> => {
  const { data: pulls } = await octokit.rest.pulls.list({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: 'all',
    sort: 'created',
    direction: 'desc',
    per_page: 100,
  })
  pulls.reverse()
  core.info(`Found pull requests ${pulls.map((pull) => `#${pull.number}`).join()}`)

  const groups = computePullRequestGroups(pulls, inputs.labelPrefix)
  core.info(`Pull request groups:`)
  for (const group of groups) {
    core.info(`* labels(${group.labels.join()}) => ${group.pulls.map((pull) => `#${pull.number}`).join()}`)
  }

  await reconcile(octokit, context.repo, groups)
}
