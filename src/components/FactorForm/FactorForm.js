import React from 'react';

import {Factors} from '../../assets/ItemAux'

export default class ItemForm extends React.Component {
        constructor(props) {
                super(props);
                this.state = {
                        value: this.props.factors[this.props.idx][0]
                };
                this.handleChange = this.handleChange.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleChange(event) {
                this.setState({value: event.target.value});
                this.props.handleEditFactor(this.props.idx, event.target.value)
        }

        handleSubmit(event) {
                event.preventDefault();
        }

        render() {
                return (<label>
                        {'Priority '}
                        {Number(this.props.idx) + 1}
                        {': '}
                        <select value={this.state.value} onChange={this.handleChange}>
                                {Object.getOwnPropertyNames(Factors).map((factor) => (<option value={Factors[factor][0]} key={Factors[factor][0]}>{Factors[factor][0]}</option>))}
                        </select>
                </label>);
        }
}
