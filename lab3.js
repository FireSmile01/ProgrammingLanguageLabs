let XMLHttpRequest = require('xhr2');

console.log("<!DOCTYPE html>\n" +
"<html>\n" +
"  <head>\n" +
"    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\n" +
"    <title>HTML Document</title>\n" +
"  </head>\n" +
"  <body>\n");

function print_div(title, date, addres, description, url)
{
	console.log("    <div>\n" +
			"      <H1><a href = \"" + url + "\" >" + title + "</a></H1>\n" +
			"<br>   Дата: " + date + "\n" +
			"<br>   Адрес: " + addres + "\n" +
			"<br>   Описание: " + description + "\n" +
			"</div>");
}

DATA = {
	'country': 'us&',
	'state': 'ma&',
	'city': 'Boston&',
	'format': 'json&',
	'limited_events': 'true&',
	'topic': 'softwaredev&',
	'time': '0,7d&',
	'radius': '50&',
	'page': '0&',
	'key': '4713c4851244b6b6f2051705b24383a'
};

let URL  = 'https://api.meetup.com/2/open_events?'
for(let el in DATA)
	URL+=el+"="+DATA[el];

function get(url, callback)
{
	var req = new XMLHttpRequest();
	req.open('GET', url, true);
	req.onreadystatechange = function() {
		if (req.readyState != 4) return;
		if (req.status != 200) {
			callback(req.status + ': ' + req.statusText);
		} else
			callback(req.responseText);
	}
	req.send();
}

get(URL, function(arg) {
	let obj = JSON.parse(arg);
	let d   = new Date(),
		d1 = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7);
	for(let el of obj.results)
	{
		if(el.time > d1.getTime()) {
			continue;
		}

		let date = new Date(el.time),
			title = el.name,
			addres = el.venue.address_1,
			description = el.description,
			url = el.event_url;

		print_div(title, date, addres, description, url);

		/*let dat = new Date(el.time);
		console.log(dat.getDate() + "." + dat.getMonth() + "." + dat.getFullYear());*/
	}
	console.log("</body>\n"+
			"</html>");
});

