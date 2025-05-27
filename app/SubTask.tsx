import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  Keyboard,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

interface todo {
  id: string;
  data: string;
}

export default function SubTask() {
  const { passedValue, passedId } = useLocalSearchParams();
  const [editTask, setEditTask] = useState("");
  const [selectedTaskID, setSelectedTaskID] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [Task, setTask] = useState("");
  const [todolist, setTodolist] = useState<todo[]>([]);

  function dateformat() {
    const date = new Date();
    const year = date.getDate();
    const month = new Date().toLocaleString("default", { month: "short" });
    const hour = date.getHours();
    const minu = date.getMinutes();
    const mili = date.getSeconds();

    return `${year}-${month} ${hour}-${minu}-${mili}`;
  }
  const addData = async () => {
    if (Task.trim() == "") return;
    await setDoc(
      doc(db, "Task", passedId.toString(), "subTask", dateformat()),
      {
        subTask: Task,
        createdAt: serverTimestamp(),
      }
    );
    setTask("");
    Keyboard.dismiss();
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Task", passedId.toString(), "subTask"),
      (list) => {
        const arr: todo[] = [];

        list.forEach((doc) => {
          arr.push({ id: doc.id, data: doc.data().subTask });
        });

        setTodolist(arr);
      }
    );
    return () => unsubscribe();
  }, []);

  async function updateTask(TaskID: string) {
    if (editTask.trim() === "") return;
    await updateDoc(doc(db, "Task", passedId.toString(), "subTask", TaskID), {
      subTask: editTask,
    });
    setEditTask("");
    setSelectedTaskID("");
    setVisibility(false);
  }
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
              placeholderTextColor={""}
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
      <View
        style={{
          height: "12%",
        }}
      >
        <Text
          style={{
            fontSize: 19,
            fontWeight: "bold",
            color: "rgb(186, 121, 23)",
            paddingTop: 25,
            paddingHorizontal: 10,
            textAlign: "center",
            justifyContent: "center",

            backgroundColor: "rgba(238, 241, 218, 0.83)",
            height: "100%",
            borderBottomRightRadius: 60,
            borderBottomLeftRadius: 60,
          }}
        >
          {passedValue}
        </Text>
      </View>
      <View style={Styling.View1}>
        <TextInput
          value={Task}
          onChangeText={(inputTxt) => setTask(inputTxt)}
          placeholder="Enter your task (max 25 characters)"
          maxLength={25}
          style={Styling.Inputbtn}
        />

        <TouchableOpacity
          onPress={() => addData()}
          style={{
            marginEnd: "4%",
            height: "100%",
            width: "15%",
            backgroundColor: "rgba(79, 159, 114, 0.45)",
            // borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
          }}
        >
          <Ionicons name="send-outline" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <View
        style={{
          height: "100%",
          alignItems: "center",
          paddingBottom: 55,
          flex: 1,
        }}
      >
        <FlatList
          style={{ width: "100%", marginTop: "8%" }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          data={todolist}
          renderItem={({ item }) => {
            async function deleleTask(id: string) {
              await deleteDoc(
                doc(db, "Task", passedId.toString(), "subTask", id)
              );
            }

            return (
              <>
                <Text
                  style={{
                    paddingLeft: 12,
                    marginTop: "4%",
                    fontSize: 11,
                    color: "rgba(40, 65, 21, 0.6)",
                    marginHorizontal: "4%",
                  }}
                >
                  {item.id}
                </Text>
                <View
                  style={{
                    marginTop: "1%",
                    marginHorizontal: "4%",
                    paddingLeft: 10,
                    paddingRight: 12,
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
                      flex: 1,

                      flexWrap: "wrap",
                      flexShrink: 1,
                      overflow: "hidden",

                      paddingRight: 17,
                      color: "rgb(31, 137, 107)",
                    }}
                    numberOfLines={2}
                  >
                    {String(item.data)}
                  </Text>
                  <View
                    style={{
                      width: "14%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setVisibility(true);
                        setSelectedTaskID(item.id);
                        setEditTask(item.data);
                      }}
                    >
                      <Ionicons
                        name="create-outline"
                        size={20}
                        color="rgba(63, 81, 181, 0.7)"
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
              </>
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
            right: 0,
            left: 0,
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
            No subtasks yet. Add your steps!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
const Styling = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "rgb(210, 233, 233)",
  },
  View1: {
    marginTop: 40,

    gap: 0,
    flexDirection: "row",
    height: "9%",
    width: "100%",
    backgroundColor: "rgb(210, 233, 233)",
  },
  Inputbtn: {
    fontSize: 15,
    marginLeft: "4%",
    paddingLeft: 20,
    paddingRight: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    height: "100%", // set fixed height for consistency
    width: "77%",
    backgroundColor: "rgb(255, 255, 255)",
    color: "rgb(69, 64, 64)", // text color
  },
});
