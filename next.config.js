module.exports = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/lists',
                permanent: true,
            },
        ]
    },
}