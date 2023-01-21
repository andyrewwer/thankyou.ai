// next.config.js
const isGithubActions = process.env.GITHUB_ACTIONS || false

module.exports = {
    assetPrefix: isGithubActions ? '/thankyou.ai/' : '',
    images: {
        unoptimized: isGithubActions,
    },
}