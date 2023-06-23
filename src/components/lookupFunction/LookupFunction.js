import React, { useState, useMemo, useEffect } from "react";
import LookupItem from "./LookupItem";
import AddLookupItem from "./AddLookupItem";
import { buildCode, createPostCall } from "./buildCode";
import { useCopyToClipboard } from "react-use";
import { MdFileCopy } from "react-icons/md";
import ManualEntry from "./ManualEntry";

function LookupFunction() {
  const [lookups, setLookups] = useState({});
  const [functionName, setFunctionName] = useState("");
  const [state, copyToClipboard] = useCopyToClipboard();
  const [commaData, setCommaData] = useState("");
  const { postBody, curlStmt } = useMemo(
    () => createPostCall({ lookupObj: lookups, name: functionName }),
    [lookups, functionName]
  );

  const getDelimiter = (el) => {
    let delimiter = ",";
    if (el.includes(`\t`)) {
      delimiter = `\t`;
    }
    return delimiter;
  };
  const parseCommaData = () => {
    const list = commaData
      .replace(/^\s+|\s+$/g, "")
      .split(`\n`)
      .map((el) => el.split(getDelimiter(el)))
      .reduce((final, el) => {
        final = { ...final, [el[0]]: el[1] };
        return final;
      }, {});
    setLookups(list);
  };

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

  return (
    <div className="flex flex-col items-start justify-start w-full h-full">
      <div className="flex flex-row items-start justify-between ">
        <div className="flex flex-col items-start justify-start flex-shrink-0 h-full mr-5">
          <div className="ml-2 flex flex-row mb-5">
            {/* FUNCTION NAME */}
            <div>
              <label htmlFor="functionName" className="px-2 font-bold text-lg">
                Function Name
              </label>
              <input
                id="functionName"
                className="input-sm input input-bordered input-success w-full max-w-xs"
                type="text"
                value={functionName}
                onChange={(e) =>
                  setFunctionName(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))
                }
              />
            </div>
            {/* NAMESPACE */}
            <div>
              <label htmlFor="namespace" className="px-2 font-bold text-lg">
                Namespace
              </label>
              <input
                id="namespace"
                className="input-sm input input-bordered input-warning w-full max-w-xs bg-gray-200"
                type="text"
                value="naviga"
                readOnly
                //onChange={(e) => setFunctionName(e.target.value)}
              />
            </div>
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
          <div className="flex flex-col justify-end items-end w-full my-2">
            <div className="ml-1 self-start font-semibold">
              Enter comma or tab delimited lookup pairs. Each pair on a new
              line.
            </div>
            <div className="text-lg font-bold self-start">
              DO NOT INCLUDE QUOTES AROUND TEXT
            </div>
            <textarea
              className="textarea textarea-primary w-full mb-2 leading-4"
              value={commaData}
              onChange={(e) => setCommaData(e.target.value)}
              rows={15}
            />
            <button className="btn btn-primary" onClick={parseCommaData}>
              Parse Lookup Pairs
            </button>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start w-full ">
          {/* API Call INFO */}
          {Object.keys(lookups).length === 0 || functionName.length === 0 ? (
            <div>
              Fill in Function Name and at least one Lookup Pair to generate
              code
            </div>
          ) : (
            <div className="w-full">
              <h3>API Call Info</h3>
              <div className="grid grid-cols-4 gap-2 border-solid border-2 border-[#ee3b3f] rounded-lg p-2">
                <div className="font-bold p-1 col-span-1 ">HTTP Verb:</div>
                <div className="flex flex-row items-center col-span-3">
                  <input
                    type="text"
                    className="input-sm input input-bordered input-accent w-full"
                    value="POST"
                    readOnly
                  />
                  <div
                    className="ml-1 border-solid border border-blue-800 rounded-md pt-1 px-1 hover:bg-blue-800 hover:text-white"
                    onClick={() => copyToClipboard("POST")}
                  >
                    <MdFileCopy />
                  </div>
                </div>
                <div className="font-bold p-1 col-span-1">API Route: </div>
                <div className="flex flex-row items-center col-span-3">
                  <input
                    type="text"
                    className="input-sm input input-bordered input-accent w-full col-span-3"
                    value="https://devbi.navigahub.com/api/functions"
                    readOnly
                  />
                  <div
                    className="ml-1 border-solid border border-blue-800 rounded-md pt-1 px-1 hover:bg-blue-800 hover:text-white"
                    onClick={() =>
                      copyToClipboard(
                        "https://devbi.navigahub.com/api/functions"
                      )
                    }
                  >
                    <MdFileCopy />
                  </div>
                </div>
                <div className="font-bold p-1 col-span-1">Auth: </div>
                <input
                  type="text"
                  className="input-sm input input-bordered input-accent w-full col-span-3"
                  value="Use Basic Auth with your Username/Password"
                  readOnly
                />
                <div className="font-bold p-1 col-span-1">Body: </div>
                <div className="flex flex-row justify-between items-start col-span-3 w-full">
                  <textarea
                    className="w-full textarea textarea-primary leading-4"
                    value={JSON.stringify({ ...postBody })}
                    readOnly
                    rows={5}
                  />
                  <div
                    className="ml-1 border-solid border border-blue-800 rounded-md pt-1 px-1 hover:bg-blue-800 hover:text-white"
                    onClick={() =>
                      copyToClipboard(JSON.stringify({ ...postBody }))
                    }
                  >
                    <MdFileCopy />
                  </div>
                </div>
              </div>
              <div className="mt-5 w-full">
                <h3>Curl Script</h3>
                <textarea
                  className="w-full textarea textarea-primary leading-4"
                  value={curlStmt}
                  readOnly
                  rows={5}
                />
              </div>
              <div className="w-[80%]"></div>
              <button
                className="btn btn-primary self-end"
                onClick={() => copyToClipboard(curlStmt)}
              >
                Copy to clipboard
              </button>
              {state.value && <p>COPIED</p>}
            </div>
          )}
        </div>
      </div>

      {(Object.keys(lookups).length !== 0 || functionName.length !== 0) && (
        <div className="w-full mt-5">
          <h3>Manual Entry</h3>
          <ManualEntry lookups={lookups} functionName={functionName} />
        </div>
      )}
    </div>
  );
}

export default LookupFunction;
