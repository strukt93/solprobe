const fileHelper = require("../helpers/util");

function description() {
    return "Lists all contracts and their functions."
}

function toHumanReadable(obj){
    var s = "";
    for(let contractName in obj) {
        if(Object.keys(obj[contractName]).length !== 0){
            s += "contract " + contractName + "\n";
            for(func of obj[contractName]){
                var name = func['name'];
                var visibility = func['visibility'];
                var modifiers = func['modifiers'].length > 0 ? func['modifiers'].join(", ") : "None";
                s += "\tfunction " + name + "()"; 
                s +=  " (" + visibility + "):\t";
                s += "modifiers: " + modifiers + "\n";
            }
            s += "\n";
        }
    }
    return s;
}

async function run(dir, options) {
    var parsed = await fileHelper.parseToJson(dir, [], options);
    if(parsed["error"]){
        return parsed;
    }
    var result = {};
    Object.keys(parsed).forEach(key => {
        const ast = parsed[key];
        ast.children.forEach(child => {
            if(child.type == "ContractDefinition" && child.kind != "interface") {
                result[child.name] = [];
                child.subNodes.forEach(subNode => {
                    if(subNode.type == "FunctionDefinition") {
                        if(subNode.name) {
                            modifiers = [];
                            subNode.modifiers.forEach(modifier => {
                                modifiers.push(modifier.name);
                            });
                            result[child.name].push({
                                name: subNode.name,
                                visibility: subNode.visibility,
                                modifiers: modifiers
                            });
                        }
                    }
                });
            }
        });
    });

    if(options.out == "text"){
        return toHumanReadable(result);
    }
    return result;
}

module.exports = {
    run: run,
    description: description
}