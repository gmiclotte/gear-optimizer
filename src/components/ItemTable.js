import React from 'react';

import Item from './Item/Item'

export default class ItemTable extends React.Component {
        render() {
                console.log(this.props.type);
                console.log(this.props[this.props.type]);
                console.log('done');
                return (<div>
                        {
                                [...this.props[this.props.type]].map(([key, value]) => {
                                        console.log(key, value);
                                        return (<Item item={value} handleClickItem={this.props.handleClickItem} key={key}/>);
                                })
                        }
                </div>);
        }
}
