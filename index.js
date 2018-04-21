require('babel-core/register')(
	{
		presets: ['stage-2', 'es2015']
	}
)

require('babel-polyfill') 

if(process.env.NODE_ENV == 'production'){
	require('./build/build.js')
}else{
	require('./build/dev-server.js')
}
