import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { legacy_createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { rootSaga } from './modules';
import { check, tempSetUser } from './modules/user';
import { HelmetProvider } from 'react-helmet-async';

const sagaMiddleware = createSagaMiddleware();
const store = legacy_createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware)),
);
const root = createRoot(document.getElementById('root'));

function loadUser () {
  try {
    const user = localStorage.getItem('user');
    if (!user) return; // 로그인 상태가 아니라면 아무것도 안 함

    store.dispatch(tempSetUser(JSON.parse(user)));
    store.dispatch(check());
  } catch (e) {
    console.log('localStorage is not working');
  }
}
    
sagaMiddleware.run(rootSaga);
loadUser();
// loadUser 함수를 sagaMiddleware.run 보다 먼저 호출하면
// CHECK 액션을 디스패치 했을 때 사가에서 이를 제대로 처리하지 않음

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </Provider>,
);

/*
- 새로고침해도 로그인 유지되도록하기
    - LoginForm과 RegisterForm 수정하기 - 동일한 try문 5줄만 삽입하면 됨
    - 브라우저에에 내장되어 있는 localStorage 사용
        - 회원가입 및 로그인 시 사용자 정보 localStorage에 저장하도록 작업함
        - 페이지를 새록침했을 때도 로그인 상태 유지하려면, 리액트 앱이 브라우저에서
          맨 처음 렌더링 될 때 localStorage 에서 값을 불러와 리덕스 스토어 안에 넣도록 구현해줘야 함
            1. 이 작업은 App컴포넌트에서 useEffect 를 사용하여 처리하거나,
            2. App컴포넌트를 클래스형 컴포넌트로 변환하여 componentDidMount 메서드를 만들고 그 안에서 처리하거나
            💡 componentDidMount와 useEffect는 컴포넌트가 한 번 렌더링된 이후에 실행되기 때문에
              이 경우에 사용자가 아주 짧은 깜빡임(로그인이 나타났다가 로그아웃이 나타나는 현상)을 경험할 수 도 있음.
              index.js에서 사용자 정보를 불러오도록 처리하고 컴포넌트를 렌더링하면 이러한 깜박임 현상이 발생하지 않음
- 리덕스 개발자 도구에서 어떤 액션이 디스패치 됐는지, 리덕스 스토어는 어떤 상태를 가지고 있는지 확인
- 현재 페이지가 새로고침 될 때 localStorage 에 사용자 정보가 들어 있다면 그 사용자 값을 리덕스 스토어에 넣음
    → 사용자가 로그인 상태인지 CHECK 액션을 디스패치하여 검증
    
    → CHECK 액션이 디스패치되면 사가를 통해 /api/check API를 호출함
    > 이 API는 성공할 수도 있고 실패할 수도 있음.
    > 만약 실패하면 사용자 상태를 초기화해야 하고 localStorage에 들어 있는 값도 지워줘야 함
- localStorage에 데이터를 따로 저장하지 않아도 /api/check API를 호출하여 로그인 상태를 유지할 수 있음
    💡 여기서 localStorage 를 따로 사용해준 이유는 사용자가 이 API를 요청하고 응답하기 전에도 로그인 상태를 보여주기 위함         
*/