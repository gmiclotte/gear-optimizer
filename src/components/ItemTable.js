import React from 'react';

import Item from './Item/Item'

export default class ItemTable extends React.Component {
        render() {
                console.log(this.props.type);
                console.log(this.props[this.props.type]);
                console.log('done');
                return (<div>
                        {
                                [...this.props[this.props.type].names].map(name => {
                                        const item = this.props[this.props.type][name];
                                        console.log(name, item);
                                        return (<Item item={item} handleClickItem={this.props.handleClickItem} key={name}/>);
                                })
                        }
                </div>);
        }
}
