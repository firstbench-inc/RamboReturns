import Gun from "gun";
import "gun/axe.js";

var db = Gun();

var userList = db.get("users");
var chatList = db.get("chats");

const addUser = (username, passwd) => {
  userList.get(username).set({ pass: passwd, chatCnt: 0 });
};

const createChat = (userMaster, chatName, chatPasswd) => {
  chatList
    .get(userMaster + chatName)
    .set({ name: chatName, passwd: chatPasswd });
  chatList
    .get(userMaster + chatName)
    .get("members")
    .set({ userId: userMaster });
};

const joinChat = (userName, chatId) => {
  chatList.get(chatId).get("members").set({ userId: userName });
};

const sendMessage = (userName, chatId, msg) => {
  chatList.get(chatId).get("Msg").set({
    sender: userName,
    content: msg,
    // time: new Date().toLocaleTimeString(),
  });
};

const readMessage = (chatId, userId) => {
  if (
    userId in
    chatList
      .get(chatId)
      .get("members")
      .once((v) => {
        v.userId;
      })
  ) {
    return chatList
      .get(chatId)
      .get("Msg")
      .once((v) => {
        v;
      });
  }
  return null;
};

// addUser("yash", "pass");
// addUser("ryah", "pass2");
//
// createChat("yash", "meowland", "aloo");

// sendMessage("yash", "yashmeowland", "cat");

// userList
//   .get("yash")
//   .map()
//   .once((v) => {
//     console.log(v);
//   });
//
// userList
//   .get("ryah")
//   .map()
//   .once((v) => {
//     console.log(v);
//   });

joinChat("ryah", "yashmeowland");

chatList
  .get("yashmeowland")
  .get("members")
  .map()
  .once((v) => {
    console.log(v);
  });

chatList
  .get("yashmeowland")
  .get("Msg")
  .map()
  .once((v) => {
    console.log(v.content);
  });

// chatList.get("chat2").put(null);
// chatList.get("chat3").set({
//   sender: "a",
//   content: "cat",
// });
//
// chatList.get("chat3").set({
//   sender: "b",
//   content: "dog",
// });
//
// userList.get("user1").set({ chats: chatList.get("chat1") });

// console.log(
//   userList
//     .get("user1")
//     .get("chats")
//     .once((v) => console.log(v)),
// );

// console.log(userList.get("user1").once((v) => console.log(v)));
// console.log(chatList.get("chat1").once((v) => console.log(v)));
// chatList
//   .get("chat3")
//   .map()
//   .once((data) => {
//     console.log(data);
//   });

// node1.get('user1').put({age: 'meow'});
// console.log(node1.get('user1').once(v => console.log(v)))

// const dataPath = "example_data";
//
// // Store multiple objects as separate nodes
// db.get(dataPath).get("item1").put({ sender: "User1", content: "Message 1" });
// db.get(dataPath).get("item2").put({ sender: "User2", content: "Message 2" });
// db.get(dataPath).get("item3").put({ sender: "User1", content: "Message 3" });
// db.get(dataPath).get("item4").put({ sender: "User2", content: "Message 4" });
//
// // db.get(dataPath)
// //   .get("item1")
// //   .on((v) => console.log(v));
// db.get(dataPath)
//   .map()
//   .on((item, key) => {
//     // Check if the item is not undefined and has not been processed already
//     // if (item && !item.processed) {
//     // console.log(`Node content: `, item);
//     console.log(`Key: ${key}`);
//     console.log(`Sender: ${item.sender}`);
//     console.log(`Content: ${item.content}`);
//
//     // Mark the item as processed to avoid duplication
//     //   db.get(dataPath).get(key).put({ processed: true });
//     // }
//   });
