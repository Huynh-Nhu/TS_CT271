const newRouter = require('./news');
const registerRouter = require('./register');
const siteRouter = require('./site');
const logRouter = require('./login');


function route(app){

    app.use('/login', logRouter);
    app.use('/news', newRouter);
    app.use('/reg', registerRouter),
    app.use('/', siteRouter),



    app.get('/search', (req, res) => {
        res.render('search');
        
      })
        
      
      app.post('/search', (req, res) => { 
        console.log(req.body);
        res.send('');
        
      })
}

module.exports = route;