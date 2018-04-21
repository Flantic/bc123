const express  = require('express')



const app = express()

const port = process.env.PORT || 80 //服务器启动端口

app.use('/', express.static('./dist'))

// require('./build')

app.listen(port, (err) => {

	if (err) {
		console.log(err)
		return
	}
    console.log(`服务器运行在 http://localhost:${port}`)
})

