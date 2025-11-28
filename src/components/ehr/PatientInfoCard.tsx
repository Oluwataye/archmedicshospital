import React from 'react';

const PatientInfoCard: React.FC<any> = ({ patient }) => {
    return (
        <div className="p-4 border rounded">
            <h2 className="text-xl">{patient?.name}</h2>
            <p>ID: {patient?.id}</p>
        </div>
    );
};

export default PatientInfoCard;
