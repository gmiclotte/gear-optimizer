import React, {Component} from 'react';

import {default as Crement} from '../Crement/Crement';
import {default as OptimizeButton} from '../OptimizeButton/OptimizeButton';

class SaveButtons extends Component {
        handleFocus(event) {
                event.target.select();
        }

        render() {
                const name = this.props.savedequip[this.props.savedidx].name === undefined
                        ? 'Slot with no name'
                        : this.props.savedequip[this.props.savedidx].name;
                return (<div className='item-section'>
                        <div style={{
                                        margin: '5px'
                                }}><OptimizeButton text={'All Saves'} running={this.props.running} abort={this.props.handleTerminate} optimize={this.props.handleOptimizeSaves}/>{' '}
                                <button onClick={this.props.handleToggleUnused}>
                                        {
                                                this.props.showunused
                                                        ? 'Unmark unused items'
                                                        : 'Mark unused items'
                                        }</button>
                        </div>
                        <input style={{
                                        width: '150px',
                                        margin: '5px'
                                }} value={name} onFocus={this.handleFocus} onChange={(e) => this.props.handleSaveName(e.target.value)}/>
                        <div style={{
                                        margin: '5px'
                                }}>
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
                                        {
                                                this.props.savedequip[this.props.savedidx].factors === undefined
                                                        ? 'No Priorities Saved...'
                                                        : 'Load Priorities'
                                        }
                                </button>
                        </div>
                </div>);

        };
}

export default SaveButtons;
