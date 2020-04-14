import React from 'react';
import {LOCALSTORAGE_NAME} from '../../constants';

export default class PortForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            save: btoa(null)
        };
        this.fresh = true;
    }

    handleSubmit(event) {
        event.preventDefault();
        this.handleClose();
    }

    handleChange(event, save) {
        if (save === undefined) {
            save = null;
            try {
                save = atob(this.state.save);
            } catch (e) {
                console.log('Error: invalid local storage imported.');
                this.handleClose();
                return;
            }
        }
        window.localStorage.setItem(LOCALSTORAGE_NAME, save);
        this.props.handleLoadStateLocalStorage();

    }

    handleFocus(event) {
        event.target.select();
    }

    handleClose() {
        this.fresh = true;
        this.props.closePortModal();
    }

    render() {
        const save = btoa(window.localStorage.getItem(LOCALSTORAGE_NAME));
        if (this.fresh) {
            //HACK: this sets the import field to the current value when opening the modal
            /* eslint-disable-next-line react/no-direct-mutation-state */
            this.state.save = save;
            this.fresh = false;
        }
        return (<form onSubmit={this.handleSubmit}>
            <label>
                {'Local storage: '}
                <input style={{
                    width: '120px',
                    margin: '10px'
                }} type="text" value={this.state.save} onChange={(e) => this.setState({save: e.target.value})}
                       autoFocus={true} onFocus={this.handleFocus}/>
            </label>
            <br/>
            <button onClick={(e) => this.handleChange(e)}>{'Import'}</button>
            {'  '}
            <button onClick={(e) => this.handleChange(e, null)}>{'Clear local storage'}</button>
            {'  '}
            <button onClick={this.props.closePortModal}>{'Cancel'}</button>
        </form>);
    }
}
