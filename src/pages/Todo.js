import React, { useCallback, useEffect, useState } from "react";
import Form from "../components/Form";
import List from "../components/List";
import axios from "axios";

const Todo = () => {
    const [todoData, setTodoData] = useState([]);
    const [todoValue, setTodoValue] = useState("");

    useEffect(() => {
        axios
            .post("/api/post/list")
            .then((res) => {
                if (res.data.success) {
                    setTodoData(res.data.initTodo);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const deleteClick = useCallback(
        (id) => {
            const nowTodo = todoData.filter((item) => item.id !== id);

            setTodoData(nowTodo);

            localStorage.setItem("todoData", JSON.stringify(nowTodo));
        },
        [todoData]
    );

    const addTodoSubmit = (event) => {
        event.preventDefault();

        let str = todoValue;
        str = str.replace(/^\s+|\s+$/gm, "");
        if (str.length === 0) {
            alert("내용을 입력하세요.");
            setTodoValue("");
            return;
        }

        const addTodo = {
            id: Date.now(),
            title: todoValue,
            completed: false,
        };

        axios
            .post("/api/post/submit", { ...addTodo })
            .then((res) => {
                if (res.data.success) {
                    setTodoData([...todoData, addTodo]);
                    setTodoValue("");
                    alert("등록");
                } else {
                    alert("실패");
                }
            })
            .catch((error) => console.log(error));
    };

    const deleteAllClick = () => {
        setTodoData([]);
        localStorage.clear();
    };

    return (
        <div className="flex justify-center w-full">
            <div className="w-full p-6 m-4 bg-white shadow">
                <div className="flex justify-between mb-3">
                    <h1>할일 목록</h1>
                    <button onClick={deleteAllClick}>Delete All</button>
                </div>

                <List
                    todoData={todoData}
                    setTodoData={setTodoData}
                    deleteClick={deleteClick}
                />

                <Form
                    todoValue={todoValue}
                    setTodoValue={setTodoValue}
                    addTodoSubmit={addTodoSubmit}
                />
            </div>
        </div>
    );
};

export default Todo;
