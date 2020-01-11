import React, {Component} from 'react';

import {default as OptimizeButton} from '../OptimizeButton/OptimizeButton';
import SaveForm from '../SaveForm/SaveForm';

class SaveButtons extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        value: this.props.savedequip[this.props.savedidx].ignore
                };
        }

        handleFocus = (event) => {
                event.target.select();
        }

        handleIgnore = (event) => {
                this.setState({
                        value: !this.state.value
                });
                let savedequip = [...this.props.savedequip];
                savedequip[this.props.savedidx] = {
                        ...savedequip[this.props.savedidx],
                        ignore: !savedequip[this.props.savedidx].ignore
                };
                this.props.handleSettings('savedequip', savedequip);
        }

        render() {
                //HACK: this sets the dropdown to the correct value after loading
                if (this.state.value !== this.props.savedequip[this.props.savedidx].ignore) {
                        /* eslint-disable-next-line react/no-direct-mutation-state */
                        this.state.value = this.props.savedequip[this.props.savedidx].ignore;
                }
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
                        <SaveForm {...this.props} loc={['savedidx']} saveIdx={this.props.savedidx}/>
                        <div style={{
                                        margin: '5px'
                                }}>
                                {/* <Crement header={'Save slot'} value={this.props.savedidx} name='savedidx' handleClick={this.props.handleCrement} min={0} max={this.props.maxsavedidx}/> */}
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
                        <div>
                                <input style={{
                                                width: '150px',
                                                margin: '5px'
                                        }} value={name} onFocus={this.handleFocus} onChange={(e) => this.props.handleSaveName(e.target.value)}/> {'Ignore used: '}
                                <input type="checkbox" checked={this.state.value} onChange={(e) => this.handleIgnore(e)}/>
                        </div>
                </div>);

        };
}

export default SaveButtons;
