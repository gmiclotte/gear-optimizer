import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MassUpdate } from '../../actions/MassUpdateItems';

const ResetItemsButton = () => {
    const dispatch = useDispatch();
    const itemdata = useSelector(state => state.optimizer.itemdata);
    const onClick = () => {
        let newItemData = { ...itemdata }
        for (let i of Object.keys(newItemData)) {
            newItemData[i].disable = false
            newItemData[i].level = 100
        }

        dispatch(MassUpdate(newItemData))
    }

    return (
        <button onClick={onClick}>Reset All Items to Original State</button>
    )
}

ResetItemsButton.propTypes = {

}
export default ResetItemsButton;
