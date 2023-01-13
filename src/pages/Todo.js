import React, { useCallback, useState, useEffect } from "react";

// React-Bootstrap
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
// import { Dropdown, DropdownButton } from "react-bootstrap";
// import Spinner from "react-bootstrap/Spinner";

// 1. 로그인 여부 파악
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import axios from "axios";
import Form from "../components/Form";
import List from "../components/List";
import Loading from "../components/Loading";
import LoadingSpinner from "../components/LoadingSpinner";

/* 
  클래스/함수 컴포넌트(용도별로 2가지 케이스)
  내용 출력 전용, 데이터 관리 용도

  클래스 형식으로 제작되는 것 class : TypeScript
  state 를 리랜더링(Re-rendering)
  Life-cycle : Mount, Update, unMount...

  함수 형식으로 제작되는 것 function
  state 를 못쓰므로 화면 갱신 어렵다.
  useState() state 변경가능
  ------------------------------
  Life-cycle 을 지원하지 않는다.
  useEffect() Life-cycle 체크가능
*/

/*
  최초에 로컬에서 todoData 를 읽어와서
  todoData 라는 useState 를 초기화해 주어야 한다.
  useState(초기값)
  초기값: 로컬에서 불러서 채운다.
*/
// let initTodo = localStorage.getItem("todoData");
// 삼항연산자를 이용해서 초기값이 없으면
// 빈배열 [] 로 초기화한다.
// 읽어온 데이터가 있으면 JSON.stringify() 저장한 파일을
// JSON.parse() 로 다시 객체화하여 사용한다.

// 로컬스토리지에 내용을 읽어온다.
// MongoDB 에서 목록을 읽어온다.
// initTodo = initTodo ? JSON.parse(initTodo) : [];

const Todo = () => {
    // console.log("Todo Rendering...");
    // MongoDB 에서 초기값 읽어서 세팅한다.
    // axios 및 useEffect 를 이용한다.
    // const [todoData, setTodoData] = useState(initTodo);
    const [todoData, setTodoData] = useState([]);
    const [todoValue, setTodoValue] = useState("");

    // 2. 로그인 상태 파악
    const navigate = useNavigate();

    const user = useSelector((state) => state.user);
    // console.log("user", user);
    useEffect(() => {
        // 사용자 로그인 여부 파악
        if (user.accessToken === "") {
            // 로그인이 안된 경우
            alert("로그인을 하셔야 합니다.");
            navigate("/login");
        } else {
            // 로그인이 된 경우
        }
    }, [user]);

    // 목록 정렬 기능
    const [sort, setSort] = useState("최신순");
    useEffect(() => {
        setSkip(0);
        getList(search, 0);
    }, [sort]);

    // 검색 기능
    const [search, setSearch] = useState("");
    const searchHandler = () => {
        setSkip(0);
        getList(search, 0);
    };

    // axios 를 이용해서 서버에 API 호출
    // 전체 목록 호출 메서드
    const getList = (_word = "", _stIndex = 0) => {
        setSkip(0);
        setSkipToggle(false);
        // 로딩창 보여주기
        setLoading(true);

        const body = {
            sort: sort,
            search: _word,
            // 사용자 구분 용도
            uid: user.uid,
            skip: _stIndex,
        };
        axios
            .post("/api/post/list", body)
            .then((response) => {
                // console.log(response.data);
                // 초기 할일데이터 셋팅
                if (response.data.success) {
                    setTodoData(response.data.initTodo);
                    // 시작하는 skip 번호를 갱신한다.
                    setSkip(response.data.initTodo.length);
                }
                // 로딩창 숨기기
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const getListGo = (_word = "", _stIndex = 0) => {
        // 로딩창 보여주기
        setLoading(true);

        const body = {
            sort: sort,
            search: _word,
            // 사용자 구분 용도
            uid: user.uid,
            skip: _stIndex,
        };
        axios
            .post("/api/post/list", body)
            .then((response) => {
                // console.log(response.data);
                // 초기 할일데이터 셋팅
                if (response.data.success) {
                    const newArr = response.data.initTodo;
                    setTodoData([...todoData, ...newArr]);
                    // 시작하는 skip 번호를 갱신한다.
                    setSkip(skip + newArr.length);
                    if (newArr.length < 5) {
                        setSkipToggle(false);
                    }
                }

                // 로딩창 숨기기
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // 목록 갯수 출력
    const [skip, setSkip] = useState(0);
    const [skipToggle, setSkipToggle] = useState(true);

    const getListMore = () => {
        getListGo(search, skip);
    };

    useEffect(() => {
        getList("", skip);
        // 초기데이터를 컴포넌트가 마운트 될 때 한번 실행한다.
    }, []);

    const deleteClick = useCallback(
        (id) => {
            if (window.confirm("정말 삭제하시겠습니까?")) {
                // 로딩창 보여주기
                setLoading(true);

                let body = {
                    id: id,
                };
                axios
                    .post("/api/post/delete", body)
                    .then((response) => {
                        console.log(response);
                        // 클릭된 ID 와 다른 요소들만 걸러서 새로운 배열 생성
                        const newTodo = todoData.filter(
                            (item) => item.id !== id
                        );
                        // console.log("클릭", newTodo);
                        // 목록을 갱신한다.
                        // axios 를 이용해서 MongoDB 삭제 진행
                        setTodoData(newTodo);

                        // 로딩창 숨기기
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }

            // 로컬에 저장한다.(DB 예정)
            // localStorage.setItem("todoData", JSON.stringify(newTodo));
        },
        [todoData]
    );

    const addTodoSubmit = (event) => {
        // 웹브라우저 새로 고침을 하면 안되므로 막아줌
        event.preventDefault();

        // 공백 문자열 제거 추가
        let str = todoValue;
        str = str.replace(/^\s+|\s+$/gm, "");
        if (str.length === 0) {
            alert("내용을 입력하세요.");
            setTodoValue("");
            return;
        }

        // 로딩창 보여주기
        setLoading(true);

        // { id: 4, title: "할일 4", completed: false }
        // todoData 는 배열이고 배열의 요소들은 위처럼 구성해야 하니까
        // 객체{}로 만들어줌
        // 그래야 .map 을 통해서 규칙적인 jsx 를 리턴할 수 있으니까
        const addTodo = {
            id: Date.now(), // id 값은 배열.map 의 key 로 활용 예정, unique 값 만들기위해
            title: todoValue, // 할일 입력창의 내용을 추가
            completed: false, // 할일이 추가될 때 아직 완료한 것은 아니므로 false 초기화

            // 1. DB 저장 : Server/Model/TodoModel Schema 업데이트(ObjectId)
            uid: user.uid, // 여러명의 사용자 구분 용도
        };
        // 새로운 할일을 일단 복사하고, 복사된 배열에 추가하여서 업데이트
        // 기존 할일을 Destructuring 하여서 복사본 만듦
        // todoData: [{},{},{},{},    {}]          [{}]
        // axios 로 MongoDB 에 항목 추가
        axios
            .post("/api/post/submit", { ...addTodo })
            .then((res) => {
                // console.log(응답.data);
                if (res.data.success) {
                    setTodoValue("");
                    // 목록 재호출
                    setSkip(0);
                    getList("", 0);

                    alert("할일이 등록되었습니다.");
                } else {
                    alert("할일 등록 실패하였습니다.");
                }

                // 로딩창 숨기기
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const deleteAllClick = () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            // 로딩창 보여주기
            setLoading(true);
            // axios 를 이용하여 MongoDB 목록 비워줌.
            axios
                .post("/api/post/deleteall")
                .then(() => {
                    setSkip(0);
                    // 로딩창 숨기기
                    setLoading(false);
                    getList("", 0);
                })
                .catch((error) => console.log(error));
        }
        // 로컬에 저장한다.(DB 예정)
        // 자료를 지운다.(DB 초기화)
        // localStorage.clear();
    };

    // 로딩창 관련
    const [loading, setLoading] = useState(false);

    return (
        <div className="flex justify-center w-full">
            <div className="w-full p-6 m-4 bg-white shadow">
                <div className="flex justify-between mb-3">
                    <h1>할일 목록</h1>
                    <button onClick={deleteAllClick}>Delete All</button>
                </div>

                <div className="flex justify-between mb-3">
                    <DropdownButton title={sort} variant="outline-secondary">
                        <Dropdown.Item onClick={() => setSort("최신순")}>
                            최신순
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setSort("과거순")}>
                            과거순
                        </Dropdown.Item>
                    </DropdownButton>
                    <div>
                        <label className="mr-2">검색어</label>
                        <input
                            type="text"
                            placeholder="검색어를 입력하세요"
                            className="border-2"
                            value={search}
                            onChange={(e) => setSearch(e.currentTarget.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    searchHandler();
                                }
                            }}
                        />
                    </div>
                </div>

                <List
                    todoData={todoData}
                    setTodoData={setTodoData}
                    deleteClick={deleteClick}
                />

                {skipToggle && (
                    <div className="flex justify-end">
                        <button
                            className="p-2 text-blue-400 border-2 border-blue-400 rounded hover:text-white hover:bg-blue-400"
                            onClick={() => getListMore()}
                        >
                            더보기
                        </button>
                    </div>
                )}

                <Form
                    todoValue={todoValue}
                    setTodoValue={setTodoValue}
                    addTodoSubmit={addTodoSubmit}
                />
            </div>
            {/* 로딩창 샘플 */}
            {loading && <LoadingSpinner />}
        </div>
    );
};

export default Todo;
