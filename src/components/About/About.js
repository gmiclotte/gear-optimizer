import React, {Component} from 'react';
import ReactGA from 'react-ga';
import './About.css';
import Modal from 'react-modal';

import GitCommit from '../../_git_commit';
import GOVersion from '../../_version';
import {default as PortForm} from '../PortForm/PortForm'

const customStyles = {
        content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)'
        }
};

class AboutComponent extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        open: false
                };
        }

        render() {
                ReactGA.pageview('/about');
                return <div>
                        <p className="center">
                                {'NGU Idle Gear Optimizer v' + GOVersion.version}
                                <br/> {'Git hash: ' + GitCommit.logMessage.slice(0, 8)}
                                <br/>
                                <a href="https://github.com/gmiclotte/gear-optimizer/issues/new" rel="noopener noreferrer" target="_blank">
                                        Report an issue.
                                </a>
                                <br/>
                                <br/> {'Not affiliated with '}
                                <a href="https://www.kongregate.com/games/somethingggg/ngu-idle" rel="noopener noreferrer" target="_blank">
                                        NGU Idle
                                </a>{'.'}
                                <br/>
                                <br/> {'All art copyright by '}
                                <a href="https://www.kongregate.com/accounts/somethingggg" rel="noopener noreferrer" target="_blank">
                                        4G
                                </a>{'.'}
                                <br/>
                                <br/>
                                <button onClick={() => this.setState({open: true})}>{'Import/Export local storage'}</button>
                        </p>
                        <Modal className='port-modal' overlayClassName='port-overlay' isOpen={this.state.open} onAfterOpen={undefined} onRequestClose={() => (this.setState({open: false}))} style={customStyles} contentLabel='Import / Export' autoFocus={false}>
                                <PortForm {...this.props} closePortModal={() => (this.setState({open: false}))}/>
                        </Modal>
                </div>
        };
}

export default AboutComponent;
