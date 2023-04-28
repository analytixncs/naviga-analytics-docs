import React, { useState } from "react";

function LookupItem({ codeIn, valueIn, onEdit, onDelete }) {
  const [code, setCode] = useState(codeIn);
  const [value, setValue] = useState(valueIn);
  console.log("CODE IN", codeIn, code);
  return (
    <div className="flex flex-row space-x-2 items-end justify-start mb-2">
      <div className="flex flex-col">
        {/* <label htmlFor="code">code</label> */}
        <input
          className="input-sm input input-bordered input-primary w-full max-w-xs"
          type="text"
          id="code"
          value={code}
          disabled
        />
      </div>
      <div className="flex flex-col">
        {/* <label htmlFor="value">Value</label> */}
        <input
          className="input-sm input input-bordered input-primary w-full max-w-xs"
          type="text"
          id="value"
          value={value}
          onChange={(e) => {
            if (!e.target.value.endsWith('"')) {
              setValue(e.target.value);
            }
          }}
        />
      </div>
      <button
        className="btn-sm btn btn-primary"
        onClick={() => {
          onEdit(code, value);
        }}
      >
        Update
      </button>

      <button
        class="btn btn-sm btn-square"
        onClick={() => {
          onDelete(code);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

export default LookupItem;
