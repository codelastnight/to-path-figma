import * as React from 'react';
import { useState } from 'react';
import * as ReactDOM from 'react-dom'
import './figma-plugin-ds.min.css'

declare function require(path: string): any
const ui = function() {
    // Declare a new state variable, which we'll call "count"
    //const [count, setCount] = useState(0);
    const onCreate = () => {parent.postMessage({ pluginMessage: { type: 'do-the-thing' } }, '*')};
    const onCancel = () => {parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')};


    return (
        <div>
            <h2 className='type type--pos-xlarge-normal' >to-path</h2>
        
            <button  className="button button--primary" id="create" onClick={onCreate}>Create</button>
            <button className='button button--secondary-destructive' onClick={onCancel}>Cancel</button>
        
      </div>
    );
  }


ReactDOM.render(ui(), document.getElementById('react-page'))