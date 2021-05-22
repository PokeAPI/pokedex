const got = require('got')
const {new_moves} = require('./new_moves.js')
const fs = require("fs")
const typemap=JSON.parse(fs.readFileSync('./id_maps/typeidmap.json', 'utf8'));
const genmap=JSON.parse(fs.readFileSync('./id_maps/genidmap.json', 'utf8'));
const targetmap=JSON.parse(fs.readFileSync('./id_maps/targetidmap.json', 'utf8'));
const { stringify } = require('querystring')

class Moves {
    
    id = "";
    name="";
    gen="";
    type="";
    power="";
    pp="";
    accuracy="";
    priority="";
    target="";
    damage="";
}
async function getTypeIDAPI(typepar){
    typename=typepar.toLowerCase()
    try{
    const response = await got(`https://pokeapi.co/api/v2/type/${typename}/`).json()
    apitext=stringify(response)
    
    
    
    id = apitext.match(/id=(\d{1,3})/)[1]
    return id
}catch(error){
    console.log(error)
}
}
function getTypeID(typename){
    for(type of typemap.typelist){
    if(type.typename==typename){
        return type.id
    }
    }}
function getGenID(genname){
    for(gen of genmap.genlist){
        if(gen.genname==genname){
            return gen.id
        }
        }}
function getTargetID(targetname){
    for(target of targetmap.targetlist){
        if(target.targetname==targetname){
                return target.id
            }
            }}
function getDClassID(damclass){
    switch(damclass){
        case 'Status':
            return 1;
        case 'Physical':
            return 2;
        case 'Special':
            return 3;
        default:
            return "";
    }
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
                move.name=moveToScrapeName.toLowerCase()
                move.name = move.name.replace('_','-')
                movegen=wiki.match(/\|gen=(\w{1,4})/)[1]
                move.gen=getGenID(movegen)
                movetype=wiki.match(/\|type=(\w{1,8})/)[1]
                move.type= getTypeID(movetype)

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
                    movetarget = wiki.match(/\|target=(\w{1,20})/)[1]
                    move.target=getTargetID(movetarget)
                    }catch(error){
                    move.target=""
                    }
                try{
                movedamage = wiki.match(/\|damagecategory=(\w{1,10})/)[1]
                move.damage = getDClassID(movedamage);
                }catch(error){
                move.damage=""
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

function sortPokemon(a, b) {
    return a.id - b.id;
}

(async () => {
    try {
        const pokemons = await scrapeMoves()
        result=""
        pokemons.sort(sortPokemon).forEach(pokemon => {
            
                result+=`${pokemon.id},${pokemon.name},${pokemon.gen},${pokemon.type},${pokemon.power},${pokemon.pp},${pokemon.accuracy},${pokemon.priority},${pokemon.target},${pokemon.damage},,,,,\n`
                
        })
        console.log(result)
        fs.writeFile("newmoves.csv", result, err => {})
    } catch (error) {
        console.log(error)
    }
})()