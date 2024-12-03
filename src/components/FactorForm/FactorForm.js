import React from 'react';
import Select from 'react-select';
import {Factors} from '../../assets/ItemAux';
import {default as Crement} from '../Crement/Crement';

export default class FactorForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: {
                value: Factors[this.props.factors[this.props.idx]][0],
                label: Factors[this.props.factors[this.props.idx]][0]
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(selectedOption) {
        this.setState({selectedOption});
        this.props.handleEditFactor(this.props.idx, Object.getOwnPropertyNames(Factors).find(factor => Factors[factor][0] === selectedOption.value));
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        const factor = Factors[this.props.factors[this.props.idx]];
        const options = Object.getOwnPropertyNames(Factors).map(factor => ({
            value: Factors[factor][0],
            label: Factors[factor][0]
        }));

        const selectedValue = options.find(option => option.value === factor[0]);

        const accslots = this.props.equip.accessory.length;

        return (
            <div className="factor-form-row">
                <div className="factor-form-select">
                    <Select
                        value={selectedValue}
                        onChange={this.handleChange}
                        options={options}
                        styles={customStyles}
                        className="basic-single"
                        classNamePrefix="select"
                        menuPortalTarget={document.querySelector('.app_container')}
                        menuPosition="fixed"
                    />
                </div>
                <div className="factor-form-crement">
                    <Crement
                        header='slots'
                        value={this.props.maxslots[this.props.idx]}
                        name={['maxslots', this.props.idx]}
                        handleClick={this.props.handleCrement}
                        min={0}
                        max={accslots}
                    />
                </div>
            </div>
        );
    }
}

const customStyles = {
    control: (provided) => ({
        ...provided,
        width: '180px',
    }),
    singleValue: (provided) => ({
        ...provided,
        fontSize: '0.8em', // Scale the text size
    }),
    input: (provided) => ({
        ...provided,
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
    }),
    option: (provided) => ({
        ...provided,
        fontSize: '0.8em', // Scale the text size
    }),
    menu: (provided) => ({
        ...provided,
    }),
};