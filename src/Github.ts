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

  constructor({ appID: id, privateKey, installationId }: { appID: string, privateKey: string, installationId: string }) {
    this.app = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        id,
        privateKey,
        installationId
      },
    })
  }

  getFile = async (owner: string, repo: string, path: string): Promise<string> => {
    const fileData = await this.app.repos.getContent({
      owner,
      repo,
      path,
    });
    
    const fileObject = Buffer.from(fileData.data.content, 'base64').toString()
    return fileObject;
  }
}