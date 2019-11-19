import React from 'react';
import {resource_priorities} from '../../assets/ItemAux';
export default class ResourcePriorityForm extends React.Component {
        constructor(props) {
                super(props);
                this.state = {
                        rp_idx: this.props.rp_idx,
                        spare_policy: this.props.spare_policy
                };
                this.handleChange = this.handleChange.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleChange(event, setting) {
                this.setState({[setting]: event.target.value});
                this.props.handleChange(event, [setting], this.props.rp_idx);
        }

        handleSubmit(event) {
                event.preventDefault();
        }

        render() {
                //HACK: this sets the dropdown to the correct value after loading
                if (this.state.rp_idx !== this.props.wishstats.rp_idx) {
                        /* eslint-disable-next-line react/no-direct-mutation-state */
                        this.state.rp_idx = this.props.wishstats.rp_idx;
                }
                //HACK: this sets the dropdown to the correct value after loading
                if (this.state.spare_policy !== this.props.wishstats.spare_policy) {
                        /* eslint-disable-next-line react/no-direct-mutation-state */
                        this.state.spare_policy = this.props.wishstats.spare_policy;
                }
                const resource_names = 'EMR';
                const policy_names = ['save', 'speed up cheapest', 'speed up in order'];
                return (<div>
                        <label key={this.props.rp_idx}>
                                {'Resource spending order: '}
                                <select value={this.state.rp_idx} onChange={e => this.handleChange(e, 'rp_idx')}>
                                        {resource_priorities.map((prio, idx) => (<option value={idx} key={idx}>{resource_names[prio[0]] + '>' + resource_names[prio[1]] + '>' + resource_names[prio[2]]}</option>))}
                                </select>
                        </label><br/>
                        <label key={this.props.rp_idx}>
                                {'Spare resource policy: '}
                                <select value={this.state.spare_policy} onChange={e => this.handleChange(e, 'spare_policy')}>
                                        {policy_names.map((policy, idx) => (<option value={idx} key={policy}>{policy}</option>))}
                                </select>
                        </label>
                </div>);
        }
}
