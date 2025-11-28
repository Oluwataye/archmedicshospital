import React from 'react';

const NewRecordForm: React.FC<any> = ({ onCancel }) => {
    return (
        <div className="p-4">
            <h3>New Record Form Placeholder</h3>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
};

export default NewRecordForm;
