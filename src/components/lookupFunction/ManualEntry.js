import React from "react";
import { buildCode, createPostCall } from "./buildCode";
import { useCopyToClipboard } from "react-use";
import { MdFileCopy } from "react-icons/md";

function ManualEntry({ lookups, functionName }) {
  const { postBody, curlStmt } = React.useMemo(
    () => createPostCall({ lookupObj: lookups, name: functionName }),
    [lookups, functionName]
  );
  console.log("POST", postBody);

  return (
    <div className="border-solid border-2 border-[#ee3b3f] rounded-lg p-2 w-full">
      {/* ROW 1 */}
      <div className="flex flex-row justify-between w-full ">
        <LabeledInput label="Function Name" value={functionName} />

        <LabeledInput label="Namespace" value="naviga" />
      </div>
      {/* DESCRIPTION  */}
      <div className="flex flex-row justify-start items-center w-full ">
        <div className="font-bold p-1 ">Description:</div>
        <div>
          If you would like a description, enter it in the Description area
        </div>
      </div>
      {/* PARAMETERS  */}
      <div className="flex flex-row justify-start items-center w-full">
        <LabeledInput label="Data Type" value="Any" />
        <LabeledInput label="Variable Name" value="inputKey" />
        <LabeledInput label="Label" value="inputKey" />
        <LabeledInput label="Sample" value="" />
      </div>
      {/* ROW 4  */}
      <div className="flex flex-row justify-start items-center w-full">
        <LabeledInput label="Script" value={postBody.script} type="textarea" />
      </div>
    </div>
  );
}

export default ManualEntry;

function LabeledInput({ label, value, type = "input" }) {
  const [state, copyToClipboard] = useCopyToClipboard();
  let inputVal = (
    <input
      className="form-input w-full"
      // className="input-sm input input-bordered input-accent w-full"
      value={value}
      readOnlhy
    />
  );

  if (type === "textarea") {
    inputVal = (
      <textarea
        className="textarea textarea-primary w-full mb-2 leading-4"
        value={value}
        rows={10}
      />
    );
  }
  return (
    <>
      <div className="flex flex-col justify-start items-start w-full flex-grow">
        <label className="font-bold m-2">{label}</label>
        <div className="flex flex-row items-center flex-grow ml-2 w-full">
          {inputVal}
          <div
            className="ml-1 border-solid border border-blue-800 rounded-md pt-1 px-1 hover:bg-blue-800 hover:text-white"
            onClick={() => copyToClipboard(value)}
          >
            <MdFileCopy />
          </div>
        </div>
      </div>
      <div className="w-5" />
    </>
  );
}
