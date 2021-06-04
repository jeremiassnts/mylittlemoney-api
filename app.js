var app = require('./config/server')

app.listen(process.env.PORT || 5000, () => {
    console.log('My little money ON')
})