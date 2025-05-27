import React, { useEffect, useState } from "react";

import {
  View,
  StyleSheet,
  TextInput,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
  useColorScheme,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";
import { router } from "expo-router";

// interface for todolist storing from firestore
interface todo {
  id: string;
  data: string;
}

//main entry point for todo app
const App = () => {
  const [visibility, setVisibility] = useState(false);
  const [editTask, setEditTask] = useState("");
  const [selectedTaskID, setSelectedTaskID] = useState("");
  const [Task, setTask] = useState("");
  const [todolist, setTodolist] = useState<todo[]>([]);

  const addData = async () => {
    if (Task.trim() == "") return;
    await addDoc(collection(db, "Task"), {
      Task,
      createdAt: serverTimestamp(),
    });
    setTask("");
    Keyboard.dismiss();
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Task"), (list) => {
      const arr: todo[] = [];

      list.forEach((doc) => {
        arr.push({ id: doc.id, data: doc.data().Task });
      });

      setTodolist(arr);
    });

    return () => unsubscribe();
  }, []);

  const deleleTask = async (ID: string) => {
    const subTaskCollectionRef = collection(db, "Task", ID, "subTask");
    (await getDocs(subTaskCollectionRef)).docs.map((singleTask) => {
      deleteDoc(doc(db, "Task", ID, "subTask", singleTask.id));
    });
    await deleteDoc(doc(db, "Task", ID));
  };

  const updateTask = async (ID: string) => {
    if (editTask.trim() === "") return;
    await updateDoc(doc(db, "Task", ID), {
      Task: editTask,
      updatedAt: serverTimestamp(),
    });
    setVisibility(false);
    setEditTask("");
    setSelectedTaskID("");
  };

  return (
    <SafeAreaView style={Styling.container}>
      {visibility && (
        <View
          style={{
            backgroundColor: "rgba(92, 89, 89, 0.79)",
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "80%",
              padding: 15,
              borderRadius: 12,
              elevation: 10,
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                fontSize: 18,
                fontWeight: "bold",
                color: "rgba(79, 159, 114, 0.8)",
              }}
            >
              Edit Task
            </Text>

            <TextInput
              placeholder="Update here..."
              value={editTask}
              onChangeText={(inp) => setEditTask(inp)}
              style={{
                width: "100%",
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 10,
                padding: 10,
                marginTop: 15,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => updateTask(selectedTaskID)}
                style={{
                  backgroundColor: "rgba(14, 101, 52, 0.77)",
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Update
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setVisibility(false)}
                style={{
                  backgroundColor: "rgba(157, 61, 39, 0.68)",
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <View style={Styling.View1}>
        <TextInput
          value={Task}
          onChangeText={(inputTxt) => setTask(inputTxt)}
          placeholder="Enter task (max 25 characters)"
          style={Styling.Inputbtn}
          maxLength={25}
          placeholderTextColor={"rgba(0, 0, 0, 0.45)"}
        />

        <TouchableOpacity
          onPress={() => addData()}
          style={{
            height: "40%",
            width: "19%",
            backgroundColor: "rgba(79, 159, 114, 0.45)",
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="send-outline" size={23} color="white" />
        </TouchableOpacity>
      </View>

      <View
        style={{
          height: "73%",
          alignItems: "center",
          paddingBottom: 55,
          justifyContent: "center",
        }}
      >
        <FlatList
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          style={{ width: "100%" }}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                alignContent: "center",
                justifyContent: "center",
              }}
            />
          )}
          data={todolist}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  marginTop: "4%",
                  marginHorizontal: "4%",
                  paddingLeft: "5%",
                  paddingRight: "3%",
                  height: 55,
                  width: "92%",
                  backgroundColor: "rgb(244, 220, 184)",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderWidth: 0.3,
                  borderRadius: 5,
                  borderColor: "gray",
                  elevation: 22,
                }}
              >
                <Text
                  style={{
                    color: "rgb(31, 137, 107)",
                    flex: 1,
                    flexWrap: "wrap",
                    flexShrink: 1,
                    overflow: "hidden",
                    maxHeight: 45,
                    paddingRight: 17,
                    fontSize: 16,
                  }}
                  numberOfLines={2}
                  onPress={() =>
                    router.push({
                      pathname: "/SubTask",
                      params: { passedValue: item.data, passedId: item.id },
                    })
                  }
                >
                  {String(item.data)}
                </Text>
                <View
                  style={{
                    width: "20%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedTaskID(item.id);
                      setEditTask(item.data);
                      setVisibility(true);
                    }}
                  >
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color="rgba(62, 80, 182, 0.51)"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/taskDetail",
                        params: { passedValue: item.data, passedId: item.id },
                      })
                    }
                  >
                    <Ionicons
                      name="information-circle"
                      size={20}
                      color="rgba(95, 160, 119, 0.56)"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleleTask(item.id)}>
                    <Ionicons
                      name="remove-circle"
                      size={20}
                      color="rgba(240, 24, 20, 0.48)"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View>
      {todolist.length === 0 && (
        <View
          style={{
            // backgroundColor: "red",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "rgba(20, 93, 93, 0.83)",
            }}
          >
            Clean slate. Start planning!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const Styling = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: " rgb(210, 233, 233)",
  },
  View1: {
    marginTop: "10%",
    flex: 1,
    gap: 0,
    flexDirection: "row",

    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "rgb(28, 30, 30)",
  },
  Inputbtn: {
    fontSize: 15,
    // marginLeft: 13,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    height: "40%",
    width: "73%",
    backgroundColor: "rgb(255, 255, 255)",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
