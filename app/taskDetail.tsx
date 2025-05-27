import { useLocalSearchParams } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { db } from "./firebase";

export default function TaskDetailPage() {
  const { passedValue, passedId } = useLocalSearchParams();
  interface todo {
    id: string;
    data: string;
  }
  const [todolist, setTodolist] = useState<todo[]>([]);

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

  return (
    <View
      style={{
        backgroundColor: "rgb(210, 233, 233)",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: "rgba(238, 241, 218, 0.83)",
          width: "100%",
          height: "12%",
          paddingHorizontal: 10,
          justifyContent: "center",
          alignItems: "center",
          borderBottomEndRadius: 50,
          borderBottomStartRadius: 50,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 19,
            fontWeight: "bold",
            color: "rgb(186, 121, 23)",
            paddingTop: 15,
            paddingHorizontal: 20,
            textAlign: "center",
            textAlignVertical: "center",
            height: 85,
            borderBottomRightRadius: 60,
            borderBottomLeftRadius: 60,
          }}
        >
          {passedValue}
        </Text>
      </View>
      <FlatList
        style={{ flex: 1, width: "100%", alignSelf: "center" }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        data={todolist}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              marginTop: 10,
              paddingHorizontal: 12,
              height: 50,
              marginHorizontal: "4%",
              backgroundColor: "rgb(244, 220, 184)",
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 0.3,
              borderRadius: 5,
              borderColor: "gray",
              elevation: 22,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontSize: 15,
                color: "rgb(55, 164, 164)",
                flex: 1,
              }}
            >
              {item.data}
            </Text>
          </View>
        )}
      />

      {todolist.length === 0 && (
        <View
          style={{
            // backgroundColor: "red",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "rgba(20, 93, 93, 0.83)",
            }}
          >
            No details added yet.
          </Text>
        </View>
      )}
    </View>
  );
}
