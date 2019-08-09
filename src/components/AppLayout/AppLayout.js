import React from 'react';
import ReactTooltip from 'react-tooltip'
import CookieBanner from 'react-cookie-banner';
import {HashRouter as Router, Route, NavLink} from 'react-router-dom';
import ReactGA from 'react-ga';

import './AppLayout.css';

import Optimizer from '../Content/Optimizer';
import Augment from '../Content/Augment';
import WishComponent from '../Content/Wishes';
import About from '../About/About';

function HowTo() {
        ReactGA.pageview('/howto');
        return <div className='howto'>
                <ol>
                        {'How to use the gear optimizer:'}
                </ol>
                <ol>
                        <li>Perform the global item setup based on game progress.</li>
                        <ul>
                                <li>Select your highest zone.</li>
                                <li>If applicable, select the highest version of your highest titan.</li>
                                <li>Select your highest looty version.</li>
                                <li>Select your highest ascended pendant version.</li>
                                <li>Select your number of accessory slots.</li>
                        </ul>
                        <br/>
                        <li>Perform additional custom item configuration in the item list on the right.</li>
                        <ul>
                                <li>Open/close a particular zone's item list by clicking the zone name.</li>
                                <li>Rightclick an item in the list to open the item editing menu.</li>
                                <li>In the item editing menu enable or disable the item, or change its level.</li>
                                <li>Equip an item from the list by clicking it.</li>
                                <li>Equiped items can be locked by rightclicking it in the equipped item list on the left.</li>
                        </ul>
                        <br/>
                        <li>Select your priorities.</li>
                        <ul>
                                <li>Priorities are handled from top (Priority 1) to bottom.</li>
                                <li>When optimizing for a priority, the optimizer computes the optimal loadout for this priority, for any remaining empty slots that were not used by previous priorities.</li>
                                <li>The slots amount limits the number of additional accessory slots that can be used for this priority.</li>
                                <li>Of course, the global accessory slot limit always applies, it might be the case that no slots remain for a priority lower down the list.</li>
                        </ul>
                        <br/>
                        <li>Click the "Optimize Gear" button to compute an optimal loadout based on the configuration.</li>
                        <br/>
                        <li>Save and compare loadouts.</li>
                        <ul>
                                <li>The stats list shows the stats of the current loadout and the difference with the currently selected save slot.</li>
                                <li>The default save slot is empty. Overwriting the last save slot creates a new empty save at the next save index.</li>
                                <li>Saving / load / delete save slots by clicking the appropriate buttons. Navigate saves by incrementing / decrementing the save index.</li>
                                <li>Deleting a slot results in the removal of that save, all saves with a higher index have their index decremented by 1.</li>
                                <li>The current saved loadout can be shown or hidden by clicking the Show / Hide button.</li>
                        </ul>
                </ol>
                <br/>
                <ol>
                        {'How to use the augments calculator:'}
                </ol>
                <ol>
                        <li>This assumes you are limited by energy, not by gold.</li>
                        <li>This assumes you are spending energy on augments and upgrades in a ratio equal to the exponents of both. Augment exponent depends on laser sword challenge completions, while upgrade exponent is always 2. Of course, if you're BBing, then you can adjust this ratio to save some energy.</li>
                        <li>Enter the number of laser sword challenge completions.</li>
                        <li>Enter the amount of time spent on augments, in minutes.</li>
                        <li>The point of equality between consecutive augments and upgrades is shown, if you get the number of augments and upgrades on the left or on the right, a similar boost to attack and defense is obtained with the same energy investment.</li>
                        <li>In practice, this means that you should swap to the augment on the right, if you can reach the amount on the left, except when BBing, then you'll have to actually check if you can reach the amount on the right.</li>
                </ol>
                <br/>
                <ol>
                        {'How to use the wishes calculator:'}
                </ol>
                <ol>
                        <li>Provide the required data in all input fields, please consider scientific notation, e.g. 1e6 instead of 1000000, or have fun counting zeroes.</li>
                        <li>Power is total power, cap is amount you actually want to spend on wishes.</li>
                        <li>For example: if you value hacks and wishes equally, then you could set R3 cap to 22.44% of your total R3 cap.</li>
                        <li>Take the wish speed modifier from the breakdown menu and write it as a decimal, i.e. "100%" becomes "1.00".</li>
                        <li>Minimal wish time, is the time you want the final level to take.</li>
                        <li>Select some wishes and target levels. For now it is assumed that you are at level "target - 1", i.e. only the last level is taken into account.</li>
                        <li>Decide the order in which resources should be spent.</li>
                        <li>A small fraction (0.1%) of each resource cap is initially assigned to each wish. A possible allocation of EMR cap will be suggested to reach the target level in each of these wishes in (close to) the shortest possible time.</li>
                </ol>
        </div>;
}
const AppLayout = props => (<div className='app_container'>

        <CookieBanner styles={{
                        banner: {
                                height: 'auto'
                        },
                        message: {
                                fontWeight: 400
                        }
                }} message='This page wants to use local storage and a cookie to respectively keep track of your configuration and consent. Scroll or click to accept.'/>
        <Router>
                <div>
                        <nav>
                                <ul className='nav-bar-list'>
                                        <li className='nav-bar-item'>
                                                <NavLink to='/' exact={true} className='nav-link' activeClassName='active'>Gear</NavLink>
                                        </li>
                                        <li className='nav-bar-item'>
                                                <NavLink to='/augment' exact={true} className='nav-link' activeClassName='active'>Augments</NavLink>
                                        </li>
                                        <li className='nav-bar-item'>
                                                <NavLink to='/wishes' exact={true} className='nav-link' activeClassName='active'>Wishes</NavLink>
                                        </li>
                                        <li className='nav-bar-item'>
                                                <NavLink to='/howto' exact={true} className='nav-link' activeClassName='active'>How to</NavLink>
                                        </li>
                                        <li className='nav-bar-item' style={{
                                                        float: 'right'
                                                }}>
                                                <NavLink to='/about/' exact={true} className='nav-link' activeClassName='active'>About</NavLink>
                                        </li>
                                </ul>
                        </nav>

                        <Route exact={true} path='/' render={(routeProps) => (<Optimizer {...routeProps} {...props} className='app_body'/>)}/>
                        <Route exact={true} path='/howto/' component={HowTo}/>
                        <Route exact={true} path='/augment/' render={(routeProps) => (<Augment {...routeProps} {...props} className='app_body'/>)}/>
                        <Route exact={true} path='/wishes/' render={(routeProps) => (<WishComponent {...routeProps} {...props} className='app_body'/>)}/>
                        <Route exact={true} path='/about/' component={About}/>
                </div>
        </Router>
        <ReactTooltip multiline={true}/>
</div>);

export default AppLayout;
