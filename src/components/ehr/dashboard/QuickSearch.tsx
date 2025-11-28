import React from 'react';
import { Input } from "@/components/ui/input";

const QuickSearch: React.FC<any> = ({ searchQuery, setSearchQuery }) => {
    return (
        <div>
            <Input placeholder="Search patients..." className="w-[300px]" />
        </div>
    );
};

export default QuickSearch;
