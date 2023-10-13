import React from "react";
import routes from "../../../static/assets/routes.json";

function APIBuilder() {
  const [company, setCompany] = React.useState("");
  const [selectedRouteObj, setSelectedRouteObj] = React.useState("");
  const [nameOrId, setNameOrId] = React.useState("");
  const [finalRoutes, setFinalRoutes] = React.useState([]);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const baseURL = `http://${company}bi.navigahub.com`;

  const routeArray = routes.apiRoutes;

  //~
  const buildAllRoutes = () => {
    if (!company || !nameOrId) {
      alert("Enter a Company and Report/Dataset Name or Id");
      return;
    }
    setFinalRoutes([]);
    routes.apiRoutes.map((routeInfo) => {
      const routeWithName = routeInfo.route.replace("{id}", nameOrId);
      const finalRoute = `${baseURL}${routeWithName}`;
      setFinalRoutes((prev) => [
        ...prev,
        {
          name: routeInfo.name,
          type: routeInfo.type,
          HTTPMethod: routeInfo.HTTPMethod.toUpperCase(),
          finalRoute,
        },
      ]);
      console.log(`${baseURL}${routeWithName}`);
    });
  };

  const runAPI = async (routeInfo) => {
    console.log("RUnning");
    if (!username || !password) {
      alert("Please enter a username and password for authentication");
      return;
    }
    const resp = await postWithBasicAuth(routeInfo.finalRoute, username, password);
    console.log("response", resp);
  };
  // //~
  // const routeUpdate = (e) => {
  //   const routeId = e.target.value;
  //   const selectedRouteObj = routeArray.find((route) => route.id == routeId);
  //   setSelectedRouteObj(selectedRouteObj);
  //   // build stuff
  //   const routeWithName = selectedRouteObj.route.replace("{id}", nameOrId);
  //   console.log("route", `${baseURL}${routeWithName}`);
  // };

  return (
    <div>
      <div className="mb-5">
        <div className="flex flex-row space-x-3 mb-3">
          <div className="flex flex-col">
            <label className="font-semibold" for="company">
              Company Identifier
            </label>
            <input
              name="company"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value.toLowerCase())}
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="font-semibold" for="reportid">
              Report/Dataset Name or Id
            </label>
            <input
              className=""
              id="reportid"
              value={nameOrId}
              onChange={(e) => setNameOrId(e.target.value.toLowerCase())}
            />
          </div>
        </div>
        <button
          className="py-2 px-2 bg-purple-300 items-center rounded-md font-bold border-solid border-purple-950"
          onClick={buildAllRoutes}
        >
          Build All Routes
        </button>
      </div>

      <div>
        {/*  <input
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /> */}
      </div>
      {finalRoutes.map((final) => {
        return (
          <div className="flex flex-row w-full items-center flex-start">
            <input
              className="w-[100px] text-lg border-0 border-b border-solid"
              type="text"
              readOnly
              value={final.name}
            />
            <input
              className="w-[75px] text-lg border-0 border-b border-solid"
              type="text"
              readOnly
              value={final.HTTPMethod}
            />
            <input
              className="grow text-lg border-0 border-b border-solid"
              type="text"
              readOnly
              value={final.finalRoute}
            />
          </div>
        );
      })}
    </div>
  );
}

export default APIBuilder;

async function postWithBasicAuth(route, username, password) {
  const encodedCredentials = btoa(`${username}:${password}`);

  const config = {
    method: "post",
    url: route,
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
    withCredentials: true,
  };

  const response = await axios(config);

  return response;
}
