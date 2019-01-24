export default function httpRequest(obj) {
  return new Promise((resolve, reject) => {
    process.nextTick(() =>
      resolve({
        client: {
          rollout: 1,
          chat: true
        }
      })
    );
  });
}
