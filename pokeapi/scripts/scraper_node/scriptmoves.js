const got = require('got')
const {new_moves} = require('./new_moves.js')
const fs = require("fs")

class Moves {
    
    id = "";
    name="";
    gen="";
    type=""
    power="";
    pp="";
    accuracy="";
    priority="";
    target="";
    damage="";
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
                move.id = wiki.match(/\|n=(\d{1,3})/)[1]
                move.name=moveToScrapeName
                move.gen=wiki.match(/\|gen=(\w{1,4})/)[1]
                move.type=wiki.match(/\|type=(\w{1,8})/)[1]
                try{
                move.power = wiki.match(/\|power=(\d{1,3})/)[1]
                }catch(error){
                    move.power=""
                }
                try{
                move.pp = wiki.match(/\|basepp=(\d{1,3})/)[1]
                }catch(error){
                    move.pp=""
                }
                try{
                move.accuracy = wiki.match(/\|accuracy=(\d{1,3})/)[1]
                }catch(error){
                move.accuracy=""
                }
                try{
                    move.priority = wiki.match(/\|priority=([+-\d]{1,3})/)[1]
                    }catch(error){
                    move.priority="0"
                    }
                try{
                    move.target = wiki.match(/\|target=(\w{1,20})/)[1]
                    }catch(error){
                    move.target=""
                    }
                move.damage = wiki.match(/\|damagecategory=(\w{1,10})/)[1]
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

function sortPokemon(a, b) {
    return a.id - b.id;
}

(async () => {
    try {
        const pokemons = await scrapeMoves()
        result=""
        pokemons.sort(sortPokemon).forEach(pokemon => {
            
                result+=`${pokemon.id},${pokemon.gen},${pokemon.type},${pokemon.name},${pokemon.power},${pokemon.pp},${pokemon.accuracy},${pokemon.priority},${pokemon.target},${pokemon.damage}\n`
                
        })
        console.log(result)
        fs.writeFile("newmoves.csv", result, err => {})
    } catch (error) {
        console.log(error)
    }
})()