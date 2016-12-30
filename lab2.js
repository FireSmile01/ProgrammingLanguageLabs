"use strict"

function remove_last(arg) {
	arg.pop();
	return arg;
}

require('fs').readFile('access.log', 'utf8', function (err,data) {
	if (err)
		return console.log(err);
	let result = {};
	const ipRegExp = new RegExp('(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}', 'g');
	let ip;
	while(ip = ipRegExp.exec(data))
	{
		const mask = remove_last(ip['0'].split('.')).join('.');

		if (!(mask in result))
			result[mask] = [ip['0']];
		else

		if(result[mask].indexOf(ip['0'])==-1)
			result[mask].push(ip['0']);
	}

	for(let mask in result)
		for(let ip in result[mask])
			console.log(result[mask][ip]);
});

