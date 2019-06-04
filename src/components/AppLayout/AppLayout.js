import React from 'react';
import ReactTooltip from 'react-tooltip'
import CookieBanner from 'react-cookie-banner';

import './AppLayout.css';

import Header from '../Header/Header';
import Content from '../Content/Content';
import Footer from '../Footer/Footer';

const AppLayout = props => (<div className="app_container">

        <CookieBanner styles={{
                banner: {
                                height: 'auto'
                },
                message: {
                                fontWeight: 400
                }
        }} message="This page wants to use local storage and a cookie to respectively keep track of your configuration and consent. Scroll or click to accept."/>
        <Header className="app_header"/>
        <Content {...props} className="app_body"/>
        <Footer className="app_footer"/>
        <ReactTooltip multiline={true}/>
</div>);

export default AppLayout;
