const got = require('got')
const fs = require("fs")
const {new_moves} = require('./new_moves.js')

class Moves {
    
    id = "";
    japanese="";
    name="";
    korean="";
    chinese="";
    french="";
    deutsch="";
    spanish="";
    italian="";
    english="";
}

async function scrapeMoves(params) {
    try {
        const moves = []
        for (const new_move of new_moves) {
            try {
                let moveToScrapeName = new_move
                console.log(`Scraping ${moveToScrapeName}`)
                const response = await got(`https://bulbapedia.bulbagarden.net/w/api.php?action=parse&page=${moveToScrapeName}_(move)&prop=wikitext&format=json`).json()
                const wiki = response.parse.wikitext['*']
                const move = new Moves
                move.id = wiki.match(/n=(\d{3})/)[1]
                try{
                    move.japanese=wiki.match(/jname=([\u3040-\u309F]{1,30})/)[1]
                    }catch(error){
                        try{
                            move.japanese=wiki.match(/jname=([\u30a0-\u30FF]{1,30})/)[1]
                        }catch(error){
                            move.japanese=""
                        }
                        
                    }
                move.name=moveToScrapeName
                try{
                move.korean=wiki.match(/\|ko=([\uAC00-\uD7A3]{1,30})/)[1]
                }catch(error){
                    move.korean=""
                }
                try{
                move.chinese=wiki.match(/\|zh_cmn=([\u4e00-\u9fa5]{1,30})/)[1]
                }catch(error){
                    move.chinese=""
                }
                try{
                move.french=wiki.match(/\|fr=([a-zA-Z\u00C0-\u017F- ']{1,30})/)[1]
                }catch(error){
                    move.french=""
                }
                try{
                move.deutsch=wiki.match(/\|de=([a-zA-Z\u00C0-\u017F- ']{1,30})/)[1]
                }catch(error){
                    move.deutsch=""
                }
                try{
                    move.spanish=wiki.match(/\|es=([a-zA-Z\u00C0-\u017F- ']{1,30})/)[1]
                    }catch(error){
                        move.spanish=""
                    }
                try{
                    move.italian=wiki.match(/\|it=([a-zA-Z\u00C0-\u017F- ']{1,30})/)[1]
                    }catch(error){
                        move.italian=""
                    }
                try{
                    move.english=wiki.match(/\|name=([a-zA-Z\u00C0-\u017F- ']{1,30})/)[1]
                    }catch(error){
                        move.english=""
                    }

                
                //move.gen = wiki.match(/\|gen=(\s{3})/)[1]
                /*move.id = wiki.match(/n=(\d{3})/)[1]
                move.gen = wiki.match(/\|gen=({1,3})/)[1]
                move.stats.at.base = wiki.match(/\|Attack=(\d{1,3})/)[1]
                move.stats.de.base = wiki.match(/\|Defense=(\d{1,3})/)[1]
                move.stats.sa.base = wiki.match(/\|SpAtk=(\d{1,3})/)[1]
                move.stats.sd.base = wiki.match(/\|SpDef=(\d{1,3})/)[1]
                move.stats.sp.base = wiki.match(/\|Speed=(\d{1,3})/)[1]*/
                
                moves.push(move)
            } catch (error) {
                console.log(error)
            }
        }
        return moves
    } catch (error) {
        throw error
    }
}

function sortMoves(a, b) {
    return a.id - b.id;
}

(async () => {
    try {
        const moves = await scrapeMoves()
        result=""
        moves.sort(sortMoves).forEach(move => {
            
                console.log(`${move.id},${move.japanese}${move.korean},${move.chinese},${move.french},${move.deutsch},${move.spanish},${move.italian},${move.english}`)
                result+=`${move.id},1,${move.japanese}\n`
                result+=`${move.id},3,${move.korean}\n`
                result+=`${move.id},4,${move.chinese}\n`
                result+=`${move.id},5,${move.french}\n`
                result+=`${move.id},6,${move.deutsch}\n`
                result+=`${move.id},7,${move.spanish}\n`
                result+=`${move.id},8,${move.italian}\n`
                result+=`${move.id},9,${move.english}\n`
                result+=`${move.id},11,${move.japanese}\n`
                result+=`${move.id},12,${move.chinese}\n`
                
                
        })
        fs.writeFile("newmove_names.csv", result, err => {})

    } catch (error) {
        console.log(error)
    }
})()