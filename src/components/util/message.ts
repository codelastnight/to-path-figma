/**
 * send data to figma plugin code
 * @param type message type
 * @param data message data in object form
 */
export function postMessage(type: string, data: object) {
  parent.postMessage(
    {
      pluginMessage: {
        type: type,
        ...data,
      },
    },
    "*"
  );
}
