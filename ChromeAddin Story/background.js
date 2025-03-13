chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("inside background file");
  if (message.action === "launchApp") {
      console.log("inside launch app block");
      // Remove "sample-bridge://"
      const actualUrl = message.url.replace("sample-bridge://", "");
      console.log("actual url:", actualUrl);
      
      console.log("connect native");
      
      chrome.runtime.sendNativeMessage("com.example.bridge", { url: actualUrl }, (response) => {
          if (chrome.runtime.lastError) {
              console.error("Native messaging error:", chrome.runtime.lastError.message);
              // If native messaging fails, assume the package is not installed.
              promptForInstallerDownload();
          } else {
                console.log("Native host connected !")
              console.log("Native host response:", response);
          }
      });
  }
  console.log("outside the launchapp block");
});

function promptForInstallerDownload() {
    console.log("Package not installed !")
    chrome.downloads.download({
        url: "C:\Users\\122734\\source\\repos\\BridgeNativeHost\\BridgeNativeHostInstaller\\BridgeNativeHostInstaller\\bin\\Debug\\BridgeNativeHostInstaller.msi", // Replace with your MSI URL
        filename: "BridgeNativeHostInstaller.msi",
        saveAs: false
    }, (downloadId) => {
        if (chrome.runtime.lastError) {
            console.error("Download error:", chrome.runtime.lastError.message);
        } else {
            console.log("Download started, ID:", downloadId);
        }
    });
console.log("logging promt")

}


// Listen for clicks on the notification buttons
// chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
//   console.log("Add listner part")
//   if (notificationId === "installerPrompt") {
//       if (buttonIndex === 0) {
//           // User clicked "Download Installer"
//           chrome.downloads.download({
//               url: "http://yourserver.com/BridgeNativeHostInstaller.msi", // Replace with your MSI URL
//               filename: "BridgeNativeHostInstaller.msi",
//               saveAs: true
//           }, (downloadId) => {
//               if (chrome.runtime.lastError) {
//                   console.error("Download error:", chrome.runtime.lastError.message);
//               } else {
//                   console.log("Download started, ID:", downloadId);
//               }
//           });
//       } else {
//           console.log("User cancelled installer download.");
//       }
//       // Clear the notification after handling
//       chrome.notifications.clear(notificationId);
//   }
// });





// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     console.log("inside background file")
//     if (message.action === "launchApp") {
//         console.log("inside launch app block")
//       // Remove "sample-bridge://" prefix to get the actual URL/executable path.
//       const actualUrl = message.url.replace("sample-bridge://", "");
//       console.log("actual url : ",actualUrl)
//       // Send a native message to the host (registered as "com.example.bridge")
     
//       console.log("connect native")
//       chrome.runtime.sendNativeMessage("com.example.bridge", { url: actualUrl }, // This must match the "name" field in your native host manifest.
//         (response) => {
//             console.log("response: ",response)
//             console.log("runtime log last error" ,chrome.runtime.lastError)
            
//           if (chrome.runtime.lastError) {
//             console.log("runtime log" ,chrome.runtime)
//             console.error("Native messaging error: ", chrome.runtime.lastError.message);
//           } else {
//             console.log("Native host response: ", response);
//           }
//         }
//       );
//     }
//     console.log("outside the launchapp block")
//   });
  // -----------------------------------------------
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log("inside background file");
//   if (message.action === "launchApp") {
//       console.log("inside launch app block");
//       // Remove "sample-bridge://" prefix to get the actual URL/executable path.
//       const actualUrl = message.url.replace("sample-bridge://", "");
//       console.log("actual url:", actualUrl);
      
//       console.log("connect native");
//       chrome.runtime.sendNativeMessage("com.example.bridge", { url: actualUrl }, (response) => {
//           if (chrome.runtime.lastError) {
//               console.error("Native messaging error:", chrome.runtime.lastError.message);
//               // If native messaging fails, assume the package is not installed.
//               promptForInstallerDownload();
//           } else {
//               console.log("Native host response:", response);
//           }
//       });
//   }
//   console.log("outside the launchapp block");
// });

// // Function to prompt the user to download the installer MSI if the native host isn't found.
// function promptForInstallerDownload() {
//   console.log("Prompting user..")
//   // You can use a more sophisticated UI instead of confirm(), if desired.
//   if (confirm("Required package is not installed. Would you like to download the installer now?")) {
//       chrome.downloads.download({
//           url: "http://yourserver.com/BridgeNativeHostInstaller.msi", // Change this URL to your MSI installer location.
//           filename: "BridgeNativeHostInstaller.msi",
//           saveAs: true
//       }, (downloadId) => {
//           if (chrome.runtime.lastError) {
//               console.error("Download error:", chrome.runtime.lastError.message);
//           } else {
//               console.log("Download started with ID:", downloadId);
//           }
//       });
//   }
// }
