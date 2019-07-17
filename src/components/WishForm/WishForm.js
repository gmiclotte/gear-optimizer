import React from 'react';

import {Wishes} from '../../assets/ItemAux'

export default class WishForm extends React.Component {
        constructor(props) {
                super(props);
                this.state = {
                        value: this.props.wishidx
                };
                this.handleChange = this.handleChange.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleChange(event) {
                this.setState({value: event.target.value});
                this.props.handleChange(event, 'wishidx', this.props.idx);
        }

        handleSubmit(event) {
                event.preventDefault();
        }

        render() {
                //HACK: this sets the dropdown to the correct value after loading
                if (this.state.value !== this.props.wishidx) {
                        /* eslint-disable-next-line react/no-direct-mutation-state */
                        this.state.value = this.props.wishidx;
                }
                return (<label key={this.props.idx}>
                        {'Wish '}
                        <select value={this.state.value} onChange={this.handleChange}>
                                {Wishes.map((wish, idx) => (<option value={idx} key={idx}>{idx + ': ' + Wishes[idx][0]}</option>))}
                        </select>
                </label>);
        }
}
