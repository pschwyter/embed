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
    followUpResponseId?: string
  },
  isForAPI = false
) {
  const {
    handle,
    cluster,
    language,
    metaFields,
    privateMode,
    followUpResponseId
  } = props;

  const clusterString = cluster ? `.${cluster}` : "";
  const location = isForAPI ? `url=${window.location.href}` : undefined;
  const newPrivateMode = privateMode ? "private=1" : undefined;
  const languageString = language ? `language=${language}` : undefined;
  const followUpResponseIdString = followUpResponseId ?
    `followUpResponseId=${followUpResponseId}` : undefined;
  const hostName = window.location.hostname;
  const metaVariables = isForAPI ? undefined : getMetaFieldstring(metaFields);

  const queryString = [
    location,
    newPrivateMode,
    languageString,
    followUpResponseIdString,
    metaVariables
  ].filter(item => item).join("&");

  const questionSym = queryString.length ? "?" : "";
  const apiOrChat = isForAPI ? "api" : "chat";

  let url = "";

  if (process.env.NODE_ENV === "development" && apiOrChat === "api") {
    url = `http://test.${hostName}:8000/${questionSym}${queryString}`;
  } else if (process.env.NODE_ENV === "development" && apiOrChat === "chat") {
    url = `http://${hostName}:8002/${questionSym}${queryString}`;
  } else {
    url =
    `https://${handle}${clusterString}.ada.support/${apiOrChat}/${questionSym}${queryString}`;
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
