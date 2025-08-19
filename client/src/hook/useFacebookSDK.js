import { useEffect, useState } from "react";

export function useFacebookSDK() {
  const [fbLoaded, setFbLoaded] = useState(false);

  useEffect(() => {
    // Don't reload if already loaded
    if (window.FB) {
      setFbLoaded(true);
      return;
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v19.0", // <-- correct version string
      });
      setFbLoaded(true);
    };

    // Inject SDK script
    if (!document.getElementById("facebook-jssdk")) {
      const js = document.createElement("script");
      js.id = "facebook-jssdk";
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      document.head.appendChild(js);
    }
  }, []);

  return fbLoaded;
}
