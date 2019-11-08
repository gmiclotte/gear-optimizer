import React from 'react';

export default class SaveForm extends React.Component {
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
                let stats;
                if (this.props.loc.length === 1) {
                        stats = Number(event.target.value);
                } else if (this.props.loc.length === 2) {
                        stats = {
                                ...this.props[this.props.loc[0]],
                                [this.props.loc[1]]: Number(event.target.value)
                        }
                } else {
                        console.log('not implemented SaveForm loc: ', this.props.loc);
                }
                this.props.handleSettings(this.props.loc[0], stats);
        }

        handleSubmit(event) {
                event.preventDefault();
        }

        render() {
                //HACK: this sets the dropdown to the correct value after loading
                if (this.state.value !== this.props.saveIdx) {
                        /* eslint-disable-next-line react/no-direct-mutation-state */
                        this.state.value = this.props.saveIdx;
                }
                return (<label key={this.props.idx}>
                        <select style={{
                                        margin: '5px'
                                }} value={this.state.value} onChange={this.handleChange}>
                                {
                                        this.props.savedequip.map((save, idx) => {
                                                let tmpname = save.name === undefined
                                                        ? 'Slot with no name'
                                                        : save.name;
                                                return (<option value={idx} key={idx}>{idx + ': ' + tmpname}</option>);
                                        })
                                }
                        </select>
                </label>);
        }
}
