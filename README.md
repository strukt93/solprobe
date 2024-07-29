# Solprobe
A little program that investigates Solidity smart contracts and returns userful information about them.

## Installation
- `npm install solprobe`

## Usage
Targets of solprobe can be single Solidity files, a directory that contains contract files, or an Ethereum address that houses verified contract code.

- List all functions accessible to privileged roles (detected via the use of function modifiers):
> npx solprobe actors TARGET

- List all contracts and their functions (shows function name, visibility, and modifiers):
> npx solprobe contracts TARGET

- Use the `-o, --out text` option to print the output in human-readable format instead of JSON. 