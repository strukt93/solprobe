# Solprobe
A little program that investigates Solidity smart contracts and returns userful information about them.

## Installation
- `npm install solprobe`

## Usage
- List all functions accessible to privileged roles (detected via the use of function modifiers):
> npx solprobe actors PATH/TO/CONTRACTS/DIRECTORY

- List all contracts and their functions (shows function name, visibility, and modifiers):
> npx solprobe contracts PATH/TO/CONTRACTS/DIRECTORY

## Features/changes to implement
1. Update the options to a single argument and operate depending on its type (file, directory, or contract address)
2. Fetch source code from a deployed contract address and probe it as long as the code is verified
3. Add human-readable output format