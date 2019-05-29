import React from 'react';
import PropTypes from 'prop-types';

import './Header.css';

const headerPropTypes = {
        className: PropTypes.string.isRequired
};

const Header = ({className}) => (<div className={className}>
        <div className="header__container">
                <nav className="navbar">
                        <span className="header__span">NGU Idle Gear Optimizer</span>
                </nav>
        </div>
</div>);

Header.propTypes = headerPropTypes;

export default Header;
