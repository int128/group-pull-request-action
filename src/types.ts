import type { Endpoints } from '@octokit/types'

export type Repository = {
  owner: string
  repo: string
}

type PullRequests = Endpoints['GET /repos/{owner}/{repo}/pulls']['response']['data']
export type PullRequest = PullRequests[number]
