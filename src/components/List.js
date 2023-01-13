import React from "react";
import { useSelector } from "react-redux";
import ListItem from "./ListItem";

const List = React.memo(({ todoData, setTodoData, deleteClick }) => {
  // console.log("List Rendering...");
  // 작성자의 글만 불러오게
  const user = useSelector((state) => state.user);

  return (
    <div>
      {todoData.map(
        (item) =>
          // 작성자의 글만 불러오게 (참이니까 () 부분이 실행된다)
          item.author.uid === user.uid && (
            <div key={item.id}>
              <ListItem
                item={item}
                todoData={todoData}
                setTodoData={setTodoData}
                deleteClick={deleteClick}
              />
            </div>
          )
      )}
    </div>
  );
});

export default List;
