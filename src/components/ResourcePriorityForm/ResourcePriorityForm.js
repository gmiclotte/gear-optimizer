import React from 'react';
import {resource_priorities} from '../../assets/ItemAux';
export default class ResourcePriorityForm extends React.Component {
        constructor(props) {
                super(props);
                this.state = {
                        value: this.props.rp_idx
                };
                this.handleChange = this.handleChange.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleChange(event) {
                this.setState({value: event.target.value});
                this.props.handleChange(event, 'rp_idx', this.props.rp_idx);
        }

        handleSubmit(event) {
                event.preventDefault();
        }

        render() {
                //HACK: this sets the dropdown to the correct value after loading
                if (this.state.value !== this.props.wishstats.rp_idx) {
                        /* eslint-disable-next-line react/no-direct-mutation-state */
                        this.state.value = this.props.wishstats.rp_idx;
                }
                const resource_names = 'EMR';
                return (<label key={this.props.rp_idx}>
                        <select value={this.state.value} onChange={this.handleChange}>
                                {resource_priorities.map((prio, idx) => (<option value={idx} key={idx}>{resource_names[prio[0]] + '>' + resource_names[prio[1]] + '>' + resource_names[prio[2]]}</option>))}
                        </select>
                </label>);
        }
}
