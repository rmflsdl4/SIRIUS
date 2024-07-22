<img src="https://capsule-render.vercel.app/api?type=waving&height=250&color=gradient&text=SpringBoot&fontAlignY=40" /> 

### 🗃️ Folder Structure
    📂 CulisoServer
        📂 src
            📂 main
                📂 java
                    📂 com
                        📂 culiso
                            📂 culiso
                                📂 config - 라이브러리, 패키지 등의 설정 파일
                                📂 controller - 라우터 처리
                                📂 entity - 데이터베이스 테이블 및 열 정의
                                📂 repository - 데이터베이스 CRUD
                                📂 service - 각 기능들을 호출
                                📃 CulisoApplication.java - 서버 실행 파일
                📂 resources
                    📂 static - html 파일 모음
                📃 application.properties - 제약 조건, 데이터 베이스 정보 등
        📃 pom.xml - 의존성 등의 내용
    



### ⚠️ Cautions

> 문제점 1 : 데이터베이스에는 userName 컬럼으로 지정, 스프링부트에서는 user_name으로 인식

📝 Linux, Unix는 대소문자 영향을 받는다. 하지만 Windows, macOS는 대소문자 영향을 받지 않는다.  
📝 JPA가 userNAME와 같은 형태가 아닌 userName 같은 형태라면 Windows, macOS에서 user_name과 같은 형식으로 변환해서 인식한다.  
📝 따라서 데이터베이스에서 카멜 표기법으로 일관되게 작성하는 것이 호환성에 좋다.
