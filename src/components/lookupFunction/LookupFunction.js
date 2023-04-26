import React, { useState, useMemo, useEffect } from "react";
import LookupItem from "./LookupItem";
import AddLookupItem from "./AddLookupItem";
import { buildCode } from "./buildCode";
import axios from "axios";
// lookups array of { key, value }
// OR { [key]: value }

const getListOfFunctions = async () => {
  console.log("IN GET LIST");
  const res = await axios.get("https://devbi.navigahub.com/api/functions", {
    // Axios looks for the `auth` option, and, if it is set, formats a
    // basic auth header for you automatically.
    auth: {
      username: "mark.mccoid",
      password: "ResidentAlien1!",
    },
  });
  console.log("res", res.data);
  return res.data;
};
function LookupFunction() {
  const [lookups, setLookups] = useState({});
  const [functionName, setFunctionName] = useState("");
  const [list, setList] = useState([]);

  const onUpdate = (code, value) => {
    console.log(code, value);
    if (code) {
      setLookups((prev) => ({ ...prev, [code]: value }));
    }
  };
  const onDelete = (code) => {
    setLookups((prev) => {
      const newLookups = { ...prev };
      delete newLookups[code];
      return newLookups;
    });
  };
  const onAddLookup = (code, value) => {
    if (code) {
      setLookups((prev) => ({ ...prev, [code]: value }));
    }
  };

  useEffect(() => {
    const getList = async () => {
      const data = await getListOfFunctions();
      setList(data);
    };
    getList();
  }, []);

  return (
    <div className="flex flex-col items-start justify-start">
      <div className="ml-2">
        <label htmlFor="functionName" className="px-2 font-bold text-lg">
          Function Name
        </label>
        <input
          id="functionName"
          className="input-sm input input-bordered input-success w-full max-w-xs"
          type="text"
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
        />
      </div>
      <div className="px-2">
        <AddLookupItem onAdd={onAddLookup} />
      </div>
      <div
        className={`p-2 flex-grow-0 ${
          Object.keys(lookups).length > 0
            ? "border-2 border-[#ee3b3f] border-solid rounded-lg"
            : ""
        }`}
      >
        {Object.keys(lookups).map((code) => {
          return (
            <LookupItem
              key={code}
              codeIn={code}
              valueIn={lookups[code]}
              onEdit={onUpdate}
              onDelete={onDelete}
            />
          );
        })}
      </div>
      {/* CODE GEN */}
      <div>
        <pre>{buildCode(lookups)}</pre>
      </div>
      <div>
        {list.map((item) => {
          return <div>{JSON.stringify(item)}</div>;
        })}
      </div>
    </div>
  );
}

export default LookupFunction;
