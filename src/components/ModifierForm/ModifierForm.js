import React from 'react';
import SaveForm from '../SaveForm/SaveForm';

export default class ModifierForm extends React.Component {
        render() {
                const name = this.props.name;
                return (<table className='center'>
                        <tbody>
                                <tr>
                                        <td>{'Advanced modifiers'}</td>
                                        <td>
                                                <input type="checkbox" checked={this.props[name].modifiers} onChange={(e) => this.props.handleSettings(name, {
                                                                ...this.props[name],
                                                                modifiers: !this.props[name].modifiers
                                                        })}/></td>
                                </tr>
                        </tbody>
                        <tbody className={this.props[name].modifiers
                                        ? ''
                                        : 'hide'}>
                                <tr>
                                        <td>Current loadout</td>
                                        <td><SaveForm {...this.props} loc={[name, 'currentLoadout']} saveIdx={this.props[name].currentLoadout}/></td>
                                </tr>
                                <tr>
                                        <td>Dedicated loadout</td>
                                        <td><SaveForm {...this.props} loc={[name, 'dedicatedLoadout']} saveIdx={this.props[name].dedicatedLoadout}/></td>
                                </tr>
                                <tr className={this.props.e || this.props.m || this.props.r
                                                ? ''
                                                : 'hide'}>
                                        <td>{'Blue Heart'}</td>
                                        <td>
                                                <label>
                                                        <input type="checkbox" checked={this.props[name].blueHeart} onChange={(e) => this.props.handleSettings(name, {
                                                                        ...this.props[name],
                                                                        blueHeart: !this.props[name].blueHeart
                                                                })}/>Maxxed
                                                </label>
                                        </td>
                                </tr>
                                <tr className={this.props.e
                                                ? ''
                                                : 'hide'}>
                                        <td>{'Energy Potion'}</td>
                                        <td>
                                                <label>
                                                        <input type="checkbox" checked={this.props[name].eBetaPot} onChange={(e) => this.props.handleSettings(name, {
                                                                        ...this.props[name],
                                                                        eBetaPot: !this.props[name].eBetaPot
                                                                })}/>Beta
                                                </label>
                                                <label>
                                                        <input type="checkbox" checked={this.props[name].eDeltaPot} onChange={(e) => this.props.handleSettings(name, {
                                                                        ...this.props[name],
                                                                        eDeltaPot: !this.props[name].eDeltaPot
                                                                })}/>Delta
                                                </label>
                                        </td>
                                </tr>
                                <tr className={this.props.m
                                                ? ''
                                                : 'hide'}>
                                        <td>{'Magic Potion'}</td>
                                        <td>
                                                <label>
                                                        <input type="checkbox" checked={this.props[name].mBetaPot} onChange={(e) => this.props.handleSettings(name, {
                                                                        ...this.props[name],
                                                                        mBetaPot: !this.props[name].mBetaPot
                                                                })}/>
                                                        Beta
                                                </label>
                                                <label>
                                                        <input type="checkbox" checked={this.props[name].mDeltaPot} onChange={(e) => this.props.handleSettings(name, {
                                                                        ...this.props[name],
                                                                        mDeltaPot: !this.props[name].mDeltaPot
                                                                })}/>
                                                        Delta
                                                </label>
                                        </td>
                                </tr>
                                <tr className={this.props.r
                                                ? ''
                                                : 'hide'}>
                                        <td>{'R3 Potion'}</td>
                                        <td>
                                                <label>
                                                        <input type="checkbox" checked={this.props[name].rBetaPot} onChange={(e) => this.props.handleSettings(name, {
                                                                        ...this.props[name],
                                                                        rBetaPot: !this.props[name].rBetaPot
                                                                })}/>
                                                        Beta
                                                </label>
                                                <label>
                                                        <input type="checkbox" checked={this.props[name].rDeltaPot} onChange={(e) => this.props.handleSettings(name, {
                                                                        ...this.props[name],
                                                                        rDeltaPot: !this.props[name].rDeltaPot
                                                                })}/>
                                                        Delta
                                                </label>
                                        </td>
                                </tr>
                        </tbody>
                </table>);
        }
}
