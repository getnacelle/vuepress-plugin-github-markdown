import Github from "./Github";

module.exports = (options) => {
  const module = {}

  try {
    const githubClient = new Github({
      appId: options.appId,
      privateKey: options.privateKey,
      installationId: options.installationId
    })

    module['additionalPages'] = async () => {
      const pagePromises = options.files.map(async ({
        modifyContent,
        path,
        owner,
        repo,
        githubFilePath
      }: PageInput): Promise<Page | void> => {
        let content = await githubClient
          .getFile(owner, repo, githubFilePath);

        // Allow content modifier
        if (modifyContent) {
          content = modifyContent(content)
        }

        return {
          path,
          content
        }
      })
      
      return await Promise.all<Page>(
        pagePromises
      )
    }
  } catch (err) {
    console.error('Error initializing Github Client', err)
  }

  return module
}

interface Page {
  path: string;
  content: string | void;
}

interface PageInput {
  modifyContent(content: string | void): string;
  path: string;
  owner: string;
  repo: string;
  githubFilePath: string;
}