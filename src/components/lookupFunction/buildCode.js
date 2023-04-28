//--------------------------------------------------
//- Build CODE
//--------------------------------------------------
export const buildCode = (lookupObj) => {
  const lookupObjCode = convertToLookups(lookupObj);
  const baseCode = `mapObj = ${lookupObjCode};

  return mapObj[inputKey] || inputKey;
  `;

  console.log("BASE CODE", baseCode);
  return baseCode;
};

//--------------------------------------------------
//- Convert to CODE
//--------------------------------------------------
const convertToLookups = (lookupObj) => {
  let code = `{\n`;
  for (let key in lookupObj) {
    code += `  ["${key}"]: "${lookupObj[key]}",\n`;
  }
  code += "}";
  return code;
};

//--------------------------------------------------
//- Build POST Call
//--------------------------------------------------
const defaultParams = {
  id: "inputKey",
  label: "inputKey",
  sample: "",
  dataType: "any",
};
export const createPostCall = ({
  lookupObj,
  name = "nameOfFunction",
  namespace = "naviga",
  description = "Description of Function",
  params = defaultParams,
}) => {
  const script = buildCode(lookupObj);

  const postBody = {
    name,
    namespace,
    description,
    script,
    params: [params],
  };
  const curlStmt = buildCurlStatment(JSON.stringify(postBody));
  return { postBody, curlStmt };
};

//--------------------------------------------------
//- Build Curl Statement
//--------------------------------------------------
const buildCurlStatment = (postCall) => {
  const curlStmt = `curl --location 'https://devbi.navigahub.com/api/functions' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Basic YOU_NEED_TO_FILL_THIS_IN' \\
--data ${postCall}`;

  return curlStmt;
};
