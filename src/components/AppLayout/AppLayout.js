import React from 'react';
import ReactTooltip from 'react-tooltip'
import CookieBanner from 'react-cookie-banner';
import {HashRouter as Router, Route, NavLink} from 'react-router-dom';
import ReactGA from 'react-ga';

import './AppLayout.css';

import Optimizer from '../Content/Optimizer';
import Augment from '../Content/Augment';
import Wishes from '../Content/Wishes';
import About from '../About/About';

function HowTo() {
        ReactGA.pageview('/howto');
        return <div className='howto'>
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
                                                <NavLink to='/' exact={true} className='nav-link' activeClassName='active'>Gear Optimizer</NavLink>
                                        </li>
                                        <li className='nav-bar-item'>
                                                <NavLink to='/howto' exact={true} className='nav-link' activeClassName='active'>How to</NavLink>
                                        </li>
                                        <li className='nav-bar-item'>
                                                <NavLink to='/augment' exact={true} className='nav-link' activeClassName='active'>Augments</NavLink>
                                        </li>
                                        <li className='nav-bar-item'>
                                                <NavLink to='/wishes' exact={true} className='nav-link' activeClassName='active'>Wishes [WIP]</NavLink>
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
                        <Route exact={true} path='/wishes/' render={(routeProps) => (<Wishes {...routeProps} {...props} className='app_body'/>)}/>
                        <Route exact={true} path='/about/' component={About}/>
                </div>
        </Router>
        <ReactTooltip multiline={true}/>
</div>);

export default AppLayout;
