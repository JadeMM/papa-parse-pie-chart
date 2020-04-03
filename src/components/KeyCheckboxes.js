import React from 'react';

export default function KeyCheckboxes(props) {
    return (
        <form>
            {props.showKeys.map((item, i) => {
                return (
                    <span  class='checks' key={`district${item.district}`}>
                        <input type='checkbox' id={`district${item.district}`}
                            checked={item.checked}
                            onChange={(e) => props.handleChange(e,i)}/>
                        <label htmlFor={`district${item.district}`}>{`District ${item.district}`}</label>
                    </span>
                )
            })}

        </form>
    )
}