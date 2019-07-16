import React from 'react';

import {Wishes} from '../../assets/ItemAux'

export default class WishForm extends React.Component {
        constructor(props) {
                super(props);
                this.state = {
                        value: this.props.wishstats.wishidx
                };
                this.handleChange = this.handleChange.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleChange(event) {
                this.setState({value: event.target.value});
                this.props.handleChange(event, 'wishidx');
        }

        handleSubmit(event) {
                event.preventDefault();
        }

        render() {
                //HACK: this sets the dropdown to the correct value after loading
                if (this.state.value !== this.props.wishstats.wishidx) {
                        /* eslint-disable-next-line react/no-direct-mutation-state */
                        this.state.value = this.props.wishstats.wishidx;
                }
                const accslots = this.props.equip.accessory.length;
                return (<label key={this.props.factors[this.props.idx]}>
                        <select value={this.state.value} onChange={this.handleChange}>
                                {Object.getOwnPropertyNames(Wishes).map((wish) => (<option value={wish} key={wish}>{'Wish ' + wish + ': ' + Wishes[wish][0]}</option>))}
                        </select>
                </label>);
        }
}
