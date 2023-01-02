import React, { useState } from "react";

const ListItem = React.memo(({ item, todoData, setTodoData, deleteClick }) => {
  // console.log("ListItem Rendering...");

  // 현재 편집 중인지 아닌지를 관리하는 State 생성
  // isEditing 이 false 라면 목록을 보여줌
  // isEditing 이 true 라면 편집을 보여줌
  const [isEditing, setIsEditing] = useState(false);
  // 제목을 출력하고 변경하는 state
  // 편집창에는 타이틀이 먼저 작정되어 있어야 하므로로
  const [editedTitle, setEditedTitle] = useState(item.title);

  // const deleteClick = (id) => {
  //   // 클릭된 id 와 다른 요소들만 걸러서 새로운 배열 생성
  //   const nowTodo = todoData.filter((item) => item.id !== id);
  //   // console.log("클릭", nowTodo);
  //   setTodoData(nowTodo);
  // };

  // 편집창 내용 갱신 처리
  const editChange = (event) => {
    setEditedTitle(event.target.value);
  };

  // 현재 item.id 에 해당하는 것만 업데이트한다
  const todoId = item.id;
  const updateTitle = () => {
    // 공백 문자열 제거 추가
    let str = editedTitle;
    str = str.replace(/^\s+|\s+$/gm, "");
    if (str.length === 0) {
      alert("제목을 입력하세요.");
      setEditedTitle("");
      return;
    }

    let tempTodo = todoData.map((item) => {
      // 모든 todoData 중에 현재 id 와 같다면
      if (item.id === todoId) {
        // 타이틀 글자를 수정하겠다
        item.title = editedTitle;
      }
      return item;
    });
    // 데이터 갱신
    setTodoData(tempTodo);
    // 로컬에 저장한다 (DB 예정)
    localStorage.setItem("todoData", JSON.stringify(tempTodo));
    // 목록창으로 이동
    setIsEditing(false);
  };

  const toggleClick = (id) => {
    // map 을 통해서 this.state.todoData 의 complete 를 업데이트 해보자
    const updateTodo = todoData.map((item) => {
      if (item.id === id) {
        // if (item.id === true) {
        //   item.completed = false;
        // } else {
        //   item.completed = true;
        // }
        item.completed = !item.completed;
      }
      return item;
    });
    setTodoData(updateTodo);
    // 로컬에 저장한다 (DB 예정)
    localStorage.setItem("todoData", JSON.stringify(updateTodo));
  };

  if (isEditing) {
    // 편집일때 JSX 리턴
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
            <button className="px-4 py-2" onClick={() => setIsEditing(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    // 목록일때 JSX 리턴
    return (
      <div key={item.id}>
        <div className="flex items-center justify-between w-full px-4 py-1 my-2 text-gray-600 bg-gray-100 border rounded">
          <div className="items-center">
            <input
              type="checkbox"
              defaultChecked={item.completed}
              onChange={() => toggleClick(item.id)}
            />
            <span className={item.completed ? "line-through" : "none"}>
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
            <button className="px-4 py-2" onClick={() => deleteClick(item.id)}>
              x
            </button>
          </div>
        </div>
      </div>
    );
  }
});

export default ListItem;
