var assetPrefix = ''
var basePath = '/'

const isGithubActions = process.env.GITHUB_ACTIONS || false

if (isGithubActions) {
    // trim off `<owner>/`
    const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '')
    assetPrefix = `/${repo}/`
    basePath = `/${repo}`
}

module.exports = {
    assetPrefix: assetPrefix,
    basePath: basePath,
    images: {
        loader: 'imgix',
        path: 'thankyou-ai.imgix.net',
    },
}
