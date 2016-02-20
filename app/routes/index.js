'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

var mDesc=[
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"];

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('www.chadtennesen.us');
		}
	}
	
	function getNatural (num){
		console.log("User passed what appears to be a unix time value");
		var natDate = new Date(parseInt(num));
		var month = natDate.getMonth();
		var day = natDate.getDate();
		var year = natDate.getFullYear();
		console.log(num, month, day, year);
		console.log(mDesc[month]);
		return "{\"unix\": "+ num +", natural: " + mDesc[month] +" " + day + ", " + year +"}";
	}

	function getUnix(str){
		console.log("User passed what appears to be a date string");
		var natArr = str.split(" ");
		var validDt=true;
		if (natArr.length!=3){
			console.log("wrong number of arguments, this clearly isn't a valid string");
			validDt=false
		} else {
			if (mDesc.indexOf(natArr[0])<0){
				// month is invalid
				console.log("couldn't figure out a valid month");
				validDt=false;
			} else {
				console.log("month appears to be valid");
				switch (mDesc.indexOf(natArr[0])){
					case 0:
					case 2:
					case 4:
					case 6:
					case 7:
					case 9:
					case 11:
						if (parseInt(natArr[1])>0 && parseInt(natArr[1])<=31){
							// valid date
							console.log("day appears to be valid");
						} else {
							console.log("day appears to be invalid"+parseInt(natArr[1]));
							validDt=false;
						}
						break;
					case 1:
						if (parseInt(natArr[1])>0 && parseInt(natArr[1])<=29){
							// valid day
							console.log("day appears to be valid");
						} else {
							console.log("day appears to be invalid"+parseInt(natArr[1]));
							validDt=false;
						}
						break;
					case 3:
					case 5:
					case 8:
					case 10:
						if (parseInt(natArr[1])>0 && parseInt(natArr[1])<=30){
							// valid day
							console.log("day appears to be valid");
						} else {
							console.log("day appears to be invalid"+parseInt(natArr[1]));
							validDt=false;
						}
						break;
				}
			}
			if (parseInt(natArr[2])>0){
				console.log("year appears to be valid");
			} else {
				console.log("year appears to be invalid");
				validDt=false;
			}
		}
		if (validDt){
			console.log(parseInt(natArr[2]),parseInt(natArr[1]),natArr[1],natArr[0],mDesc.indexOf(natArr[0]));
			var date=new Date(parseInt(natArr[2]),mDesc.indexOf(natArr[0]),parseInt(natArr[1]),0,0,0,0);
			var dateNum=date.getTime();
			return "{ \"unix\": " + dateNum + ", \"natural\": " + str + " }";
		} else {
			return "{ \"unix\": null, \"natural\": null }"
		}
	}

	var clickHandler = new ClickHandler();
	
	app.route('/:dtObj')
		.all(function (req, res){
			var resp;
			if (req.params.dtObj>0){
				var unx=req.params.dtObj;
				resp=getNatural(unx);
				res.send(resp);
			} else {
				resp=getUnix(req.params.dtObj);
				res.send(resp);
			}
		});


/* OLD CODE
	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
*/
};