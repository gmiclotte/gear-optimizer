import React from 'react';
import PropTypes from 'prop-types';

import './Footer.css';

const footerPropTypes = {
        className: PropTypes.string.isRequired
};

const Footer = ({className}) => (<div className={className}>
        <div className="footer__container">
                <p className="footer__p">
                        {'Not affiliated with '}
                        <a href="https://www.kongregate.com/games/somethingggg/ngu-idle" rel="noopener noreferrer" target="_blank">
                                NGU Idle
                        </a>{'. All art copyright by '}
                        <a href="https://www.kongregate.com/accounts/somethingggg" rel="noopener noreferrer" target="_blank">
                                4G
                        </a>{'. '}
                        <a href="https://github.com/gmiclotte/gear-optimizer/issues/new" rel="noopener noreferrer" target="_blank">
                                Report an issue.
                        </a>
                </p>
        </div>
</div>);

Footer.propTypes = footerPropTypes;

export default Footer;
