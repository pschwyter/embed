/**
 * Generate the Chat / API URL
 */
export default function constructURL(
  props: {
    handle: string,
    cluster?: string,
    privateMode?: boolean,
    language?: string,
    metaFields?: object,
    route?: string
    followUpResponseId?: string,
    greeting?: string
  },
  isForAPI = false
) {
  const {
    handle,
    cluster,
    language,
    metaFields,
    route,
    privateMode,
    followUpResponseId,
    greeting
  } = props;

  const clusterString = cluster ? `.${cluster}` : "";
  const hostName = window.location.hostname;
  const routeString = route ? `${route}/` : "";

  let queryString = "";
  let url = "";

  if (isForAPI) {
    // Query string for requests to API
    queryString = `url=${window.location.href}`;
  } else {
    // Query string for Chat URL
    const newPrivateMode = privateMode ? "private=1" : undefined;
    const greetingString = greeting ? `greeting=${greeting}` : undefined;
    const languageString = language ? `language=${language}` : undefined;
    const metaVariables = metaFields ? getMetaFieldstring(metaFields) : undefined;
    const followUpResponseIdString = followUpResponseId ?
      `followUpResponseId=${followUpResponseId}` : undefined;

    queryString = [
      newPrivateMode,
      greetingString,
      languageString,
      metaVariables,
      followUpResponseIdString
    ].filter(item => item).join("&");
  }

  const questionSym = queryString.length ? "?" : "";
  const apiOrChat = isForAPI ? "api" : "chat";

  if (process.env.NODE_ENV === "development" && apiOrChat === "api") {
    url = `http://test.${hostName}:8000/${routeString}${questionSym}${queryString}`;
  } else if (process.env.NODE_ENV === "development" && apiOrChat === "chat") {
    url = `http://${hostName}:8002/${routeString}${questionSym}${queryString}`;
  } else {
    url =
    `https://${handle}${clusterString}.ada.support/${
      apiOrChat}/${routeString}${questionSym}${queryString}`;
  }

  return url;
}

/**
 * Returns a "&" separated string of key value pairs
 */
export function getMetaFieldstring(metaFields: object) {
  if (!metaFields) { return; }

  const reservedKeys = ["url", "private", "language"];

  const variableArray = Object.keys(metaFields)
    .filter(key => !reservedKeys.includes(key))
    .map((key) => {
      return `${key}=${metaFields[key]}`;
    });

  return variableArray.join("&");
}
