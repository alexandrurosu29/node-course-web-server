'use strict';

// nodemon server.js -e .js,.hbs
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

let app = express();

// header + footer
hbs.registerPartials(__dirname + '/views/partials');

// use handlebars for templating
app.set('view engine', 'hbs');

// middleware
app.use((req, res, next) => {
	let now = new Date().toString();

	let log = `${now}: ${req.method} ${req.url}`;

	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
		if(err) {
			console.log('Unable to append to server.log.');
		}
	});

	next();
});

// simulate a maintenance middleware (we do not call 'next()')
// app.use((req, res, next) => {
// 	res.render('maintenance.hbs');
// })

// stores path to node-web-server in __dirname
// set it here to be handled by middleware
app.use(express.static(__dirname + '/public'));

// inject this method in all templates that we want
hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});

app.get('/', (req, res) => {
	// res.send('<h1>Hello Express!</h1>');
	// res.send({
	// 	name: 'Alex',
	// 	likes: [
	// 		'Biking',
	// 		'Cities'
	// 	]
	// })
	res.render('home.hbs', {
		pageTitle: 'Home page',
		welcomeMessage: 'Welcome to my website'
	})
});

app.get('/about', (req, res) => {
	// send dynamic data to templating page
	res.render('about.hbs', {
		pageTitle: 'About page'
	});
});

app.get('/bad', (req, res) => {
	res.send({
		error: 'Unable to handle request'
	});
});

app.listen(3000, () => {
	console.log('Server started');
});