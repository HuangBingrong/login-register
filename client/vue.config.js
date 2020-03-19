module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
	outputDir: __dirname + '/../server/client/'
}
