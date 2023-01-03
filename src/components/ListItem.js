import axios from "axios";
import React, { useState } from "react";

const ListItem = React.memo(({ item, todoData, setTodoData, deleteClick }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(item.title);

    const editChange = (event) => {
        setEditedTitle(event.target.value);
    };

    const todoId = item.id;
    const updateTitle = () => {
        let str = editedTitle;
        str = str.replace(/^\s+|\s+$/gm, "");
        if (str.length === 0) {
            alert("제목을 입력하세요.");
            setEditedTitle("");
            return;
        }

        let tempTodo = todoData.map((item) => {
            if (item.id === todoId) {
                item.title = editedTitle;
            }
            return item;
        });

        let body = {
            id: todoId,
            title: item.title,
        };

        axios
            .post("/api/post/updatetitle", body)
            .then((res) => setTodoData(tempTodo))
            .catch((err) => console.log(err));

        setIsEditing(false);
    };

    const toggleClick = (id) => {
        const updateTodo = todoData.map((item) => {
            if (item.id === id) {
                item.completed = !item.completed;
            }
            return item;
        });

        let body = {
            id: todoId,
            completed: item.completed,
        };
        axios
            .post("/api/post/updatetoggle", body)
            .then((res) => setTodoData(updateTodo))
            .catch((err) => console.log(err));
    };

    if (isEditing) {
        return (
            <div key={item.id}>
                <div className="flex items-center justify-between w-full px-4 py-1 my-2 text-gray-600 bg-gray-100 border rounded">
                    <div className="items-center">
                        <input
                            type="text"
                            className="w-full px-3 py-2 mr-4 text-gray-500 bg-white border rounded"
                            value={editedTitle}
                            onChange={editChange}
                        />
                    </div>
                    <div className="items-center">
                        <button className="px-4 py-2" onClick={updateTitle}>
                            Update
                        </button>
                        <button
                            className="px-4 py-2"
                            onClick={() => setIsEditing(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div key={item.id}>
                <div className="flex items-center justify-between w-full px-4 py-1 my-2 text-gray-600 bg-gray-100 border rounded">
                    <div className="items-center">
                        <input
                            type="checkbox"
                            defaultChecked={item.completed}
                            onChange={() => toggleClick(item.id)}
                        />
                        <span
                            className={item.completed ? "line-through" : "none"}
                        >
                            {item.title}
                        </span>
                    </div>
                    <div className="items-center">
                        <button
                            className="px-4 py-2"
                            onClick={() => {
                                setIsEditing(true);
                                setEditedTitle(item.title);
                            }}
                        >
                            Edit
                        </button>
                        <button
                            className="px-4 py-2"
                            onClick={() => deleteClick(item.id)}
                        >
                            x
                        </button>
                    </div>
                </div>
            </div>
        );
    }
});

export default ListItem;
