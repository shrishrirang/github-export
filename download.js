var argv = require('yargs').argv,
    rp = require('request-promise'),
    fs = require('fs');

var options = {
        uri: 'https://api.github.com/repos/' + argv.repo + '/issues',
        headers: {
            'User-Agent': 'download-issues'
        }
    },
    issueFilePath = './issues.csv';

rp(options)
    .then(function(response) {
        console.log('Starting to download ' + options.uri);
        return writeIssuesToFile(JSON.parse(response));
    })
    .then(function(result) {
        console.log('Issues download at ' + issueFilePath);
    }, function(error) {
        console.log('Attempted to fetch : ' + options.uri);
        console.log(error.message);
        throw error;
    });

function writeIssuesToFile(issues) {
    var issueCsvString = 'id,milestone,title,issueUrl' + '\n';

    for (var i in issues) {
        var issue = issues[i];

        if (issue.state !== 'open') {
            continue;
        }


        var id = issue.number,
            issueUrl = 'https://github.com/' + argv.repo + '/issues/' + issue.number,
            title = '"' + issue.title + '"',
            milestone = issue.milestone ? issue.milestone.title : 'no milestone';

        issueCsvString += id + ',' + milestone + ',' + title + ',' + issueUrl + '\n';
    }

    return fs.writeFileSync(issueFilePath, issueCsvString);
}
