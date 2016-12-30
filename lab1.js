"use strict";
var request = require('request');

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

const baseUrl="http://www.mosigra.ru";
let linkQueue = [baseUrl];
const mailPattern = '[a-zA-Z0-9]+(?:[._+%-]+[a-zA-Z0-9]+)*@(?:[a-zA-Z0-9]?)+[.][a-zA-Z]{2,}';
let urlPattern = 'href="(?:<siteURL>)?(?:\\.\\.)*(?:\\/?[a-zA-Z0-9%-])+\\??(?:[a-zA-Z0-9]+\\=[a-zA-Z0-9_%-]+[;&]?)*(?:\\.html|\\.htm|\\/)?"';
let tempUrl = baseUrl.replaceAll("/", "\\/").replaceAll("\\.", "\\.").replaceAll("-", "\\-");
urlPattern = urlPattern.replace("<siteURL>", tempUrl);

const mailRegExp = new RegExp(mailPattern, 'g');
const urlRegExp = new RegExp(urlPattern, 'g');
let checkedLinks = [];
let mails = [];
function find()
{
	console.log(mails);
	console.log(checkedLinks.length);
	if ((checkedLinks.length < 50) && (linkQueue.length>0))
	{
		let link = linkQueue.pop();
		if(checkedLinks.indexOf(link)>-1)
		{
			find();
			return;
		}
		checkedLinks.push(link);
		request(link, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				const result = body;
				let matchUrl = [];
				let matchMail = [];
				let url;

				while(url = urlRegExp.exec(result)) {
					matchUrl.push(url['0']);
				}

				let mail;

				while(mail = mailRegExp.exec(result)) {
					matchMail.push(mail['0']);
				}

				if(matchUrl != null) {
					matchUrl.forEach(function (url, i, arr) {
						let processableUrl = url.substring(0, url.length - 1);
						processableUrl = processableUrl.replace('href=\"', "");
						let refinedUrl = processableUrl;

						if (processableUrl[0] == ".") {
							processableUrl = processableUrl.replace('\.\.\/', "");
							refinedUrl = link + processableUrl;
						} else
						if (processableUrl[0] == "/") {
							refinedUrl = baseUrl + processableUrl;
						} else
						if (processableUrl.startsWith("http://") == false) {
							refinedUrl = baseUrl + "/" + processableUrl;
						}

						if (linkQueue.indexOf(refinedUrl)==-1) {
							linkQueue.push(refinedUrl);
						}
					});
				}

				if(matchMail!=null) {
					matchMail.forEach(function (mail, i, arr) {
						if(mails.indexOf(mail)==-1) {
							mails.push(mail);
						}
					});
				}

				find();
			} else {
				console.log(error+" "+response.statusCode);
			}
		});
	}
}

find();
for(let elem of mails)
	console.log(elem);

