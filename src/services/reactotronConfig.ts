// src/reactotronConfig.ts
import Reactotron from 'reactotron-react-native';

// ===== If using a real device over Wi-Fi, set your PC’s LAN IP here =====
const HOST = '192.168.8.48'; // <- replace with your machine IP
// If using USB + adb reverse, you can omit host (comment it) and use step 4A.

const tron = Reactotron.configure({
  name: 'HopnCrew',
  host: HOST, // comment this out if using USB + adb reverse
  // port defaults to 9090
})
  .useReactNative({
    networking: {
      // show fetch/XMLHttpRequest (covers fetch & axios)
      ignoreUrls: /symbolicate|generate_204/,
    },
    errors: { veto: () => false },
  })
  .connect();

// Optional: expose for quick logs: console.tron.log(...)
if (__DEV__) {
  // @ts-ignore
  console.tron = tron;
}

export default tron;
