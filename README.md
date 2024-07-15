# Solprobe
A little program that investigates Solidity smart contracts and returns userful information about them.

## Installation
- `npm install solprobe`

## Usage
- List all functions accessible to privileged roles (detected via the use of function modifiers):
> solprobe --dir PATH/TO/CONTRACTS/DIRECTORY --actors