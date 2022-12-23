import React from 'react';

const Btn = ({children, onClick, title}) => {
    return ( 
        <button className='btn btn-primary' onClick={onClick} title={title || ""}>
            {children}
        </button>
     );
}
 
export default Btn;