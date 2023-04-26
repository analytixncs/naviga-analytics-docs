export const buildCode = (lookupObj) => {
  const lookupObjCode = convertToCode(lookupObj);
  const baseCode = `mapObj = ${lookupObjCode};

  return mapObj[inputKey] || inputKey;
  `;

  console.log("BASE CODE", baseCode);
  return baseCode;
  return baseCode.replace(lookupObjCode, convertToCode(lookupObj));
};

const convertToCode = (lookupObj) => {
  let code = `{\n`;
  for (let key in lookupObj) {
    code += `  ["${key}"]: "${lookupObj[key]}",\n`;
  }
  code += "}";
  return code;
};
