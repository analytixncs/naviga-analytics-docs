import React, { useState } from "react";

function AddLookupItem({ onAdd }) {
  const [code, setCode] = useState("");
  const [value, setValue] = useState("");

  return (
    <div
      className="flex flex-row space-x-2 items-end justify-start mb-2"
      // style={{ border: "1px solid black" }}
    >
      <div className="flex flex-col">
        <label htmlFor="code" className="font-bold ml-2">
          Code
        </label>
        <input
          className="input-sm input input-bordered input-primary w-full max-w-xs"
          type="text"
          id="code"
          value={code}
          onChange={(e) => {
            if (!e.target.value.endsWith('"')) {
              setCode(e.target.value);
            }
          }}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="value" className="font-bold ml-2">
          Value
        </label>
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
      <div
        className="py-1 px-2 bg-purple-300 items-center rounded-md font-bold border-solid border border-purple-950"
        onClick={() => {
          onAdd(code, value);
          setCode("");
          setValue("");
        }}
      >
        Save
      </div>
    </div>
  );
}

export default AddLookupItem;
