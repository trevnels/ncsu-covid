const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const http = require('http');
const https = require('https');
const e = require('express');
const app = require('express')();

const QUERY_URL = "https://www.ncsu.edu/coronavirus/testing-and-tracking/"

let credentials = null
if(fs.existsSync('/etc/letsencrypt/live')) {
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/linode.cobaltrisen.com/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/linode.cobaltrisen.com/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/linode.cobaltrisen.com/chain.pem', 'utf8');

    credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };
}

function getDailyCases(cb) {
    fetch(QUERY_URL).then(b => b.text()).then(h => {
        let $ = cheerio.load(h)

        let dailyCases = $('.text-mod.code-mod').first()
        let quarantineInfo = $('.text-mod.code-mod')[4]

        let dailyData = {
            cases: {},
            quarantine: {}
        }
        $('.table-responsive td', dailyCases).each(function(i) {
            let text = $(this).text()

            if(i == 1) dailyData.cases.student = parseInt(text)
            if(i == 4) dailyData.cases.employee = parseInt(text)
            if(i == 7) dailyData.cases.total = parseInt(text)
        })

        $('.table-responsive td', quarantineInfo).each(function(i) {
            let text = $(this).text()
            
            if(i == 1) dailyData.quarantine.unitsTotal = parseInt(text)
            if(i == 3) dailyData.quarantine.unitsUsed = parseInt(text.split(' ')[0])
            if(i == 5) dailyData.quarantine.individuals = parseInt(text)
        })

        let head = $('.table-responsive th', dailyCases).get(1)
        let date = $(head).text().replace('Daily New Cases ','')
        cb(date, dailyData)
    });
}

function updateFile() {
    let data = JSON.parse(fs.readFileSync('data.json', {encoding:'utf-8'}))
    getDailyCases((date, dailyData) => {
        if(!Object.keys(data).includes(date)) console.log("New daily data recorded for "+date)
        data[date] = dailyData
        fs.writeFileSync('data.json', JSON.stringify(data))
    })
}

setInterval(updateFile, 60*60*1000)
updateFile()

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://trevnels.github.io');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// getDailyCases()

app.get('/data', (req, res) =>{
    res.sendFile(__dirname + '/data.json')
})

if(credentials) {
    console.log("Starting secure server")
    const httpsServer = https.createServer(credentials,app)
    httpsServer.listen(3000)
} else {
    console.log("Starting insecure server")
    const httpServer = http.createServer(app)
    httpServer.listen(3000)
}