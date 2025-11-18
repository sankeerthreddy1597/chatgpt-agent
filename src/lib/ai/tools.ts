import { Type } from "@google/genai";

async function getLocation() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  return { city: "San Jose", latitude: 37.3512, longitude: -121.8846 };
}

async function getCurrentWeather(latitude: string, longitude: string) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=apparent_temperature`;
  const response = await fetch(url);
  const weatherData = await response.json();
  return weatherData;
}

const weatherFunctionDeclaration = {
  name: "getCurrentWeather",
  description: "Gets the current temperature for a given location.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      latitude: {
        type: Type.STRING,
        description: "latitude of the location",
      },
      longitude: {
        type: Type.STRING,
        description: "longitude of the location",
      },
    },
    required: ["latitude", "longitude"],
  },
};

const locationFunctionDeclaration = {
  name: "getLocation",
  description: "Gets the current location of the user",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

export const functionDeclarations = [
  weatherFunctionDeclaration,
  locationFunctionDeclaration,
];

export const availableTools = {
  getCurrentWeather,
  getLocation,
};

export const toolNameMapper = {
    getCurrentWeather: "Fetching weather",
    getLocation: "Getting location",
}