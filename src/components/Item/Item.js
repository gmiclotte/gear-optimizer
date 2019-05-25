import React, {Component} from 'react';
import PropTypes from 'prop-types';

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
                item: PropTypes.shape({name: PropTypes.string.isRequired, level: PropTypes.number.isRequired}),
                handleClickItem: PropTypes.func.isRequired
        };

        render() {
                if (this.props.item === undefined) {
                        return (<span><img data-tip='Empty slot' style={{
                                        'width' : '50px',
                                        'height' : '50px'
                                }} src={images.logo} className="App-logo" alt='Empty'/>
                        </span>);
                }
                let tt = this.props.item.name + ' lvl ' + this.props.item.level + '<br />';
                this.props.item.stats.map((stat, idx) => {
                        tt += '<br />' + stat[0] + ': ' + stat[1];
                        return undefined;
                })
                return (<img onClick={() => this.props.handleClickItem(this.props.item.name)} data-tip={tt} style={{
                                'width' : '50px',
                                'height' : '50px'
                        }} src={images[this.props.item.name]} alt={this.props.item.name} key='item'/>);
        }
}
