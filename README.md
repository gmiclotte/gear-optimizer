## Gear Optimizer

Gear Optimizer computes the optimal gear layout for specific features in [NGU Idle](https://www.kongregate.com/games/somethingggg/ngu-idle). [All artwork in this project](src/assets/img) is owned by the owner of NGU Idle and used here with permission, the license of this project does not apply to these files.  

## How to

Select up to 5 priorities, priority 1 is highest priority, if slots remain then the computation is continued with the remaining slots for priority 2 etc. Respawn and daycare have an explicit limit on allowed slots.  
Increase or decrease number of desired respawn and daycare items, and the number of accessory slots. Filter an item by clicking it once in the items list, these items will be ignored for the optimalisation, but you can still manually equip them. Double click an item in the items list to equip it manually. Rightclick an item to change its level. Click an item in the equipment list to unequip it. Items with level `< 100` and filtered items are shown at the bottom of the left column, clicking items here has the same effect as in the main items list.  

Start the computation by clicking the `Optimize Gear` button. Right now it can be very slow if many items are available. Luckily you can simply choose to abort the current computation, or just come back tomorrow and hope it finished.

## Algorithm

WIP  
Basis of the algorithm is pareto optimal filtering and dynamic programming knapsack algorithm.

## TODO

Speed up the computations by filtering more paths.  
Clean the click behaviour, double click counting as three actions is ugly and bad.  
Add filter for entire sets.  
Add option to specify current zone, auto filter everything beyond
Add some [issues](https://github.com/gmiclotte/gear-optimizer/issues) for these todos or just fix them.  

## Dev notes

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). [React-app-rewired](https://github.com/timarney/react-app-rewired) is used to handle web worker integration.

## How to install and compile

```
git clone https://github.com/gmiclotte/gear-optimizer.git  
cd gear-optimizer  
npm i  
npm run start  
npm run deploy  
```
`npm run start` hosts a local copy, `npm run deploy` builds and deploys to `gh-pages` branch
