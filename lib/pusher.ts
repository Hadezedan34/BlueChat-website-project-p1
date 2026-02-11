import Pusher from "pusher";
import PusherClient from "pusher-js";

// هاد للسيرفر (Backend)
export const pusherServer = new Pusher({
  appId: "2113406",
  key: "d4b39e150da4d3e4c5c3",
  secret: "caba078021eb38173da8",
  cluster: "eu",
  useTLS: true,
});

// هاد للمتصفح (Frontend)
export const pusherClient = new PusherClient("d4b39e150da4d3e4c5c3", {
  cluster: "eu",
});