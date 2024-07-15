#!/usr/bin/env node

const actorsFilter = require("./src/filters/actors");

const args = require('yargs').argv;
const dir = args.dir;
const actors = args.actors;

if(!dir){
    console.log("Use the --dir flag to specify the contracts directory.");
    process.exit(1);
}

if(!actors) {
    console.log("Choose your filters:\n--actors: Print the actors with privileged access to functions (detected via modifiers).");
    process.exit(1);
}

if(actors){
    actorsFilter.getActors(dir);
}
