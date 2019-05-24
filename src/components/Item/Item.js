import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip'

//import './Item.css';

function importAll(r) {
        let images = {};
        r.keys().map((item, index) => {
                images[item.replace('./', '').replace(/\.[^/.]+$/, '')] = r(item);
                return undefined;
        });
        return images;
}
const images = importAll(require.context('../../assets/img/', false, /\.(png|jpe?g|svg)$/));

export default class Item extends Component {
        static propTypes = {
                item: PropTypes.shape({name: PropTypes.string.isRequired, slot: PropTypes.string.isRequired, level: PropTypes.number.isRequired}),
                handleClickItem: PropTypes.func.isRequired
        };

        render() {
                if (this.props.item === undefined) {
                        return (<div className="text-truncate">
                                <div>
                                        <img src={images.logo} className="App-logo" alt='logo'/>
                                </div>
                        </div>);
                }
                var tt = this.props.item.name + ' lvl ' + this.props.item.level;
                return (<div className="text-truncate" onClick={() => this.props.handleClickItem(this.props.item.name)}>
                        <div data-tip={tt}>
                                <img src={images[this.props.item.name]} className="App-logo" alt={this.props.item.name}/>
                                <ReactTooltip/>
                        </div>
                </div>);
        }
}
