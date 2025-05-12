// client/pages/policysense.js
import { useEffect, useState } from 'react';

export default function PolicySense() {
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        fetch('/api/policies')
            .then(res => res.json())
            .then(setPolicies);
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">PolicySense Tracker</h1>
            {policies.map((p, i) => (
                <div key={i} className="mb-4 border-b pb-4">
                    <a href={p.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                        {p.url}
                    </a>
                    <p className="text-sm text-gray-500">Last Updated: {new Date(p.lastUpdated).toLocaleString()}</p>
                    <p className="mt-2">{p.content}</p>
                </div>
            ))}
        </div>
    );
}
