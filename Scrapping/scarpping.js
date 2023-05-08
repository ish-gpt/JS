const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const { clear } = require("console");
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

request(url, function (err, res, html) {
    if (err) {
        console.log(err);
    } else {
        extractHtml(html);
    }
});

function extractHtml(html) {
    let folderName = __dirname + '/IPL';
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(path.join(__dirname, 'IPL'), (err) => {
            if (err) {
                console.log("ERR-", err);
            }
        })
    }
    console.log(__dirname);
    let $ = cheerio.load(html);
    let elementArr = $(".ds-border-t.ds-border-line.ds-text-center.ds-py-2");
    let href = ($(elementArr).find("a").attr('href'));
    let allMatchesUrl = "https://www.espncricinfo.com/" + href;
    // console.log(allMatchesUrl);
    request(allMatchesUrl, function (err, res, html) {
        if (err) {
            console.log(err);
        } else {
            extracAllMatchHtml(html);
        }
    });
}

function extracAllMatchHtml(html) {
    let $ = cheerio.load(html);
    let ele = $('.ds-w-full.ds-bg-fill-content-prime.ds-overflow-hidden.ds-rounded-xl.ds-border.ds-border-line');
    let allMatch = ($(ele[0]).find('.ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent'));
    for (let i = 0; i < allMatch.length; i++) { //change 1 to ->allMatch.length
        let href = $(allMatch[i]).find("a").attr("href");
        let matchLink = "https://www.espncricinfo.com/" + href;
        requestHtml(matchLink, i);
        // console.log(matchLink);
    }
    console.log("\n\n");
}

function requestHtml(matchLink, i) {
    request(matchLink, function (err, res, html) {
        if (err) {
            console.log(err);
        } else {
            matchSummary(html, i);
        }
    })
}

function matchSummary(html, i) {
    let $ = cheerio.load(html);
    let teams = $('.ci-team-score.ds-flex.ds-justify-between.ds-items-center.ds-text-typo.ds-mb-2').find("a");
    let aboutMatch = $('.ds-text-tight-m.ds-font-regular.ds-text-typo-mid3').text().split(",");
    let result = $('.ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo');
    let venue = aboutMatch[1].trim();
    let date = aboutMatch[2].trim();
    let matchResult = result.text();
    // console.log(venue + "   " + date + "   " + matchResult );
    let team1Name = ($(teams[0]).find("span").text());
    let team2Name = ($(teams[1]).find("span").text());
    let folderName = __dirname + '/IPL/' + team1Name;
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName, err => {
            if (err) {
                console.log("Error creating team folder - ", err);
            }
        })
    }
    let battingTables = $('.ds-rounded-lg.ds-mt-2');

    let battingTable = $(battingTables).find(".ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table");
    // let teams = $(battingTables).find(".ds-text-title-xs.ds-font-bold.ds-capitalize");

    let rows = $(battingTable).find("tr");
    for (let j = 0; j < rows.length; j++) {
        let playerData = $(rows[j]).find("td");
        let isValidRow = $(playerData[0]).hasClass("ds-w-0 ds-whitespace-nowrap ds-min-w-max ds-flex ds-items-center");

        if (isValidRow) {
            let playerName = $(playerData[0]).text();
            let playerRun = $(playerData[2]).text();
            let playerFours = $(playerData[5]).text();
            let playerSix = $(playerData[6]).text();


            console.log(playerName + " has " + playerRun + " run with " + playerFours + " fours " + playerSix + " sixes ");
        }
    }
    console.log("\n\n\n");

    // console.log(team1Name + "  VS  " + team2Name + "------" + i);
}






















































// function extractHtmlForWicket(html) {
//     let $ = cheerio.load(html);
//     let elementArr = $(".ds-mt-3");

//     for (let i = 0; i < elementArr.length; i++) {
//         let teamNameEle = $(elementArr[i]).find(".ds-rounded-lg.ds-mt-2");
//         for (let j = 0; j < teamNameEle.length; j++) {
//             let teamNameEle1 = $(teamNameEle[j]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize");
//             for (let k = 0; k < elementArr.length; k++) {
//                 if ($(teamNameEle1[k]).text().trim() === "Chennai Super Kings") {
//                     let teamBowler = $(teamNameEle).find(".ds-w-full.ds-table.ds-table-md.ds-table-auto tbody");
//                     let rowData = $(teamBowler[1]).find("tr");
//                     for (let l = 0; l < rowData.length; l++) {
//                         let actualData = $(rowData[l]).find("td");
//                         if ($(actualData[0]).hasClass("ds-items-center")) {
//                             let playerName = $(actualData[0]).text();
//                             let playerWick = $(actualData[4]).text();
//                             console.log(`player ${playerName} has taken ${playerWick} wickets`);
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }
