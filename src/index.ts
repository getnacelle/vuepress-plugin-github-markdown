import Github from "./Github";

module.exports = (options) => {
  console.log('start')

  const githubClient = new Github({
    appID: options.appID,
    privateKey: options.privateKey,
    installationId: options.installationId
  });

  return {
    async additionalPages () {
      const pagePromises = options.files.map(async ({
        title,
        path,
        owner,
        repo,
        githubFilePath
      }: PageInput): Promise<Page> => {
        let content = await githubClient
          .getFile(owner, repo, githubFilePath);

        if (title) {
          content = `# ${title} \n` + content
        }

        return {
          path,
          content
        }
      })

      const pages = await Promise.all<Page>(
        pagePromises
      )

      return pages
    }
  }
}

interface Page {
  path: string;
  content: string;
}

interface PageInput {
  title: string;
  path: string;
  owner: string;
  repo: string;
  githubFilePath: string;
}