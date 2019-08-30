const ScriptCalls = {};

ScriptCalls.getStreamingPlayer = function getStreamingPlayer() {
  const url = "https://api.napster.com/v2/streaming-player.js";
  return fetch(url, {
    method: 'GET'
  })
    .then(result => result.text())
    .catch(err => Error(err, "Loading Streaming Player"));
};


export default ScriptCalls;
