import React, {Component} from 'react';

import {default as Crement} from '../Crement/Crement';

class SaveButtons extends Component {
        render() {
                return (<div>
                        <Crement header={'Save slot'} value={this.props.savedidx} name='savedidx' handleClick={this.props.handleCrement} min={0} max={this.props.maxsavedidx}/>
                        <button onClick={this.props.handleSaveSlot}>
                                {'Save'}
                        </button>
                        <button onClick={this.props.handleLoadSlot}>
                                {'Load'}
                        </button>
                        <button onClick={this.props.handleDeleteSlot}>
                                {'Delete'}
                        </button>
                        <button onClick={this.props.handleToggleSaved}>
                                {
                                        this.props.showsaved
                                                ? 'Hide'
                                                : 'Show'
                                }
                        </button>
                        <button onClick={this.props.handleLoadFactors}>
                                {'Load Priorities'}
                        </button>
                </div>);

        };
}

export default SaveButtons;
