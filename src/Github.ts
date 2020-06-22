const { Octokit } = require('@octokit/rest')
const { createAppAuth } = require('@octokit/auth-app')

export default class Github {
  app: typeof createAppAuth;
  appAuthentication: {
    type: string;
    token: string;
    appId: string;
    expiresAt: string;
  };
  installationId: string;

  constructor({ appId: id, privateKey, installationId }: GithubParams) {
    // Handle missing params
    if (!id || !privateKey || !installationId) {
      const missingParams: string[] = []
      for (const key in arguments[0]) {
        if(!arguments[0][key]) {
          missingParams.push(key)
        }
      }
      throw new Error(`Missing parameter(s): ${missingParams}. Cannot import markdown files from Github.`)
    }

    // Initialize Github client
    this.app = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        id,
        privateKey,
        installationId
      }
    })
  }

  getFile = async (owner: string, repo: string, path: string): Promise<string | void> => {
    try {
      const fileData = await this.app.repos.getContent({
        owner,
        repo,
        path
      })
      
      return Buffer
        .from(fileData.data.content, 'base64')
        .toString()
    } catch (err) {
      console.error(`Error Fetching Markdown File: ${owner}/${repo}/${path}`, err)
    }
  }
}

interface GithubParams {
  appId: string,
  privateKey: string,
  installationId: string
}