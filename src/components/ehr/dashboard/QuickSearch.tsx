import React from 'react';
import { Input } from "@/components/ui/input";

const QuickSearch: React.FC = () => {
    return (
        <div>
            <Input placeholder="Search patients..." className="w-[300px]" />
        </div>
    );
};

export default QuickSearch;
