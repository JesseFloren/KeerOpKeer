import { useEffect, useState } from "react";

export default ({children, count}: {children: (index: number) => JSX.Element, count: number}) => {
    const [range, setRange] = useState([]);
    useEffect(() => {
        let temp = [];
        for(let i = 0; i < count; i++) temp.push(i);
        setRange(temp);
    }, [count])
    
    return (
        <>{range.map((i) => children(i))}</>
    );
}