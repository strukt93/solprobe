#!/usr/bin/env node
const { program, Option } = require('commander');
const filters = {};
const filtersPath = require('path').join(__dirname, 'src/filters');
require('fs')
    .readdirSync(filtersPath)
    .forEach((file) => {
    const name = file.replace(/\.js$/, '');
    const filterObj = require(`./src/filters/${file}`);
    if(typeof filterObj.description === 'function' && typeof filterObj.run === 'function'){
        filters[name] = filterObj;
    }else{
        console.log(`Filter "${name}" has no description() or run() function, skipping...`);
    }
});

Object.keys(filters).forEach(filter => {
    program
        .command(`${filter}`)
        .description(filters[filter].description())
        .argument('<dir>', 'Contracts directory to scan.')
        // .addOption(new Option('-o, --out <output_type>', 'Output type.').choices(['json', 'text']).default('json'))
        .action((directory, options) => {
            var result = filters[filter].run(directory);
            console.log(JSON.stringify(result, null, 2));
            // if(options.out == "json"){
            //     console.log(JSON.stringify(result, null, 2));
            // }else{
            //     console.log(JSON.stringify(result, null, '\t'));
            // }
        });
});
program
    .command('list')
    .description('List available filters.')
    .action(function() {
        Object.keys(filters).forEach(filter => {
            console.log(`- ${filter}: ${filters[filter].description()}`)
        });
    });
program.parse();