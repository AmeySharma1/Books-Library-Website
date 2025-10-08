import { useState } from 'react';

export default function AddStatusModal({ isOpen, onClose, onSave }) {
  const [status, setStatus] = useState('To Read');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-80">
        <h3 className="text-lg font-semibold mb-4">Choose Status</h3>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border p-2 rounded mb-4 text-black"
        >
          <option value="To Read" className="text-black">To Read</option>
          <option value="Reading" className="text-black">Reading</option>
          <option value="Read" className="text-black">Read</option>
        </select>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(status)}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
