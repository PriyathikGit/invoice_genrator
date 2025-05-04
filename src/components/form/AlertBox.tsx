'use client'

import React from 'react'

type AlertBoxProps = {
    payload: object,
    setShowAlert: (val: boolean) => void
}

const AlertBox: React.FC<AlertBoxProps> = ({ payload, setShowAlert }) => {
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative bg-[#222831] border border-gray-300 p-6 rounded-lg max-w-xl w-full 
            mx-4 max-h-[80vh] overflow-auto shadow-lg">
                <button
                    onClick={() => setShowAlert(false)}
                    className="fixed right-8 hover:text-black text-lg cursor-pointer z-100"
                    aria-label="Close"
                >
                    ✖
                </button>
                <h2 className="text-lg font-semibold mb-2">Payload</h2>
                <pre className="text-sm whitespace-pre-wrap break-words">
                    {JSON.stringify(payload, null, 2)}
                </pre>
            </div>
        </div>
    );
}

export default AlertBox