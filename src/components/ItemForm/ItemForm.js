import React from 'react';

export default class ItemForm extends React.Component {
        constructor(props) {
                super(props);
                this.state = {
                        value: this.props.editItem[2]
                };

                this.handleChange = this.handleChange.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleSubmit(event) {
                this.props.handleEditItem(this.state.value)
                event.preventDefault();
                this.props.closeEditModal();
        }

        handleChange(event) {
                let val = event.target.value;
                while (val[0] === '0') {
                        val = val.substr(1);
                }
                if (val.length === 0) {
                        val = 0;
                } else {
                        val = Number(val);
                }
                if (isNaN(val)) {
                        val = 100;
                }
                this.setState({value: val});
        }

        render() {
                let able = 'Disable';
                if (this.props.itemdata[this.props.editItem[1]] !== undefined && this.props.itemdata[this.props.editItem[1]].disable) {
                        able = 'Enable'
                }
                return (<form onSubmit={this.handleSubmit}>
                        {this.props.editItem[1]}<br/>
                        <label>
                                {'Level:'}
                                <input style={{
                                                width: '50px',
                                                margin: '10px'
                                        }} type="text" value={this.state.value} onChange={this.handleChange}/>
                        </label>
                        <br/>
                        <input type='submit' value='Update'/>
                        <button onClick={() => this.props.handleDisableItem(this.props.editItem[1])}>{able}</button><br/>
                        <button onClick={this.props.closeEditModal}>{'Cancel'}</button>
                </form>);
        }
}
