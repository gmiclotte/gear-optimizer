import React from 'react';

import {Factors} from '../../assets/ItemAux'
import {default as Crement} from '../Crement/Crement';

export default class ItemForm extends React.Component {
        constructor(props) {
                super(props);
                this.state = {
                        value: Factors[this.props.factors[this.props.idx]][0]
                };
                this.handleChange = this.handleChange.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleChange(event) {
                this.setState({value: event.target.value});
                this.props.handleEditFactor(this.props.idx, Object.getOwnPropertyNames(Factors).filter((factor) => (Factors[factor][0] === event.target.value))[0])
        }

        handleSubmit(event) {
                event.preventDefault();
        }

        render() {
                let factor = Factors[this.props.factors[this.props.idx]];
                //HACK: this sets the dropdown to the correct value after loading
                if (this.state.value !== factor[0]) {
                        /* eslint-disable-next-line react/no-direct-mutation-state */
                        this.state.value = factor[0];
                }
                const accslots = this.props.equip.accessory.length;
                return (<label key={this.props.factors[this.props.idx]}>
                        {'Priority '}
                        {Number(this.props.idx) + 1}
                        {': '}
                        <select value={this.state.value} onChange={this.handleChange}>
                                {Object.getOwnPropertyNames(Factors).map((factor) => (<option value={Factors[factor][0]} key={Factors[factor][0]}>{Factors[factor][0]}</option>))}
                        </select>
                        <Crement header='slots' value={this.props.maxslots[this.props.idx]} name={['maxslots', this.props.idx]} handleClick={this.props.handleCrement} min={0} max={accslots}/>
                </label>);
        }
}
