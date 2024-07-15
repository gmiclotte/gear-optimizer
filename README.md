## Gear Optimizer

Gear Optimizer computes the optimal gear layout for specific features in [NGU Idle](https://www.kongregate.com/games/somethingggg/ngu-idle). [All artwork in this project](src/assets/img) is owned by the owner of NGU Idle and used here with permission, the license of this project does not apply to these files.  

## How to

Select up to 5 priorities, priority 1 is highest priority, if slots remain then the computation is continued with the remaining slots for priority 2 etc. Each priority has an explicit limit on allowed accessory slots.  
Increase or decrease number of allowed slots, and the total number of accessory slots. Move to your highest zone to prevent the optimization from taking items into account that you have no access to.

Equip an item by clicking it once in the items list. Click an item in the equipment list to unequip it. 
Rightclick an item to change its level or to filter it, filtered items will be ignored for the optimalisation, but you can still manually equip them. Items with level `< 100` and filtered items are shown at the bottom of the left column, clicking items here always opens the edit window. Click the name of a zone in the items list to hide all its items.

Start the computation by clicking the `Optimize Gear` button. It should finish in milliseconds to minutes. Sometimes it can be a lot slower if many items are available. Luckily you can simply choose to abort the current computation, or just come back tomorrow and hope it finished.

## Algorithm

Basis of the algorithm is pareto optimal filtering and dynamic programming knapsack algorithm.
Fast algorithm iteratively replaces the worst candidate accessories with the best alternative, until no more swaps improve the build.

## Acknowledgements

Many thanks to the NGU community on Discord for the helpful discussions.

## Dev notes

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). [React-app-rewired](https://github.com/timarney/react-app-rewired) is used to handle web worker integration.

## How to install and compile

```
git clone https://github.com/gmiclotte/gear-optimizer.git  
cd gear-optimizer  
npm i  
npm run init  
npm run start

# with Node 17+ you might have to set the OpenSSL Legacy Provider
export NODE_OPTIONS=--openssl-legacy-provider
# you might have to set HOST env variable to localhost
HOST=localhost

```
`npm run start` hosts a local copy, `npm run deploy` builds and deploys to `gh-pages` branch
