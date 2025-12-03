# Laygo Interactive Webconsole — 설치 & 실행 가이드



Laygo Interactive Webconsole은 **Laygo 기반 회로 배치·설계 자동화 기능을 웹 환경에서 실행**할 수 있도록 구축된 관리용 Webconsole이다.
Node.js 기반으로 동작하며 PM2를 통해 서버를 관리하고, MongoDB를 통해 사용자 및 프로젝트 데이터를 저장한다.

---

# 📂 0. 폴더 구조

```
laygo_web_console/
├── Design/                # 서버 구성요소 분석(JS/EJS/CSS), 요구사항 정리
│
├── Implementation_linux/  # 리눅스 서버에서 사용하는 Webconsole 서버
│
└── README.md              # 설치/사용 가이드
```

---

# 🚀 1. 초기 세팅

## 1) Node.js & PM2 설치

서버 구동은 Node.js로, 프로세스 유지 및 관리에는 PM2를 사용한다.

```bash
# Node.js 설치 (nvm 기반)
nvm install 20
nvm use 20
nvm alias default 20

# PM2 설치
npm i -g pm2

# 버전 확인
node -v    # v20.x
npm -v
pm2 -v
```

---

## 2) Webconsole 코드 설치

`bag_workspace_gpdk045` 와 동일한 경로에서 실행:

```bash
git clone https://github.com/sehoon120/Laygo_Interactive_Webconsole.git laygo_web_console
```

실행 후 구조는 다음과 같아야 한다:

```
<현재 경로>/
├── bag_workspace_gpdk045/
└── laygo_web_console/
```

---

## 3) Laygo 코드 변경 반영 (매우 중요)

Webconsole과 연동되도록 하기 위해 Laygo 내부 일부 파일을 교체해야 한다.

📂 위치:

```
laygo_web_console/Implementation_linux/Laygo/
```

이 디렉토리에 **수정된 파일 모음**이 있으며,
각 파일의 **상단 주석에 교체 대상 경로**가 적혀 있다.

### ✔ 적용 절차

1. 수정 파일들을 **기존 Laygo repo(bag_workspace_gpdk045)**에 복사
2. 각 파일 내 지시된 경로로 원본 파일을 교체
3. Laygo 실행용 shell script 파일 생성 및 수정

   * 기존 `start_bag.sh` 대신
     → **`start_bag_test.sh`** 파일을 생성하여 사용
   * 이 파일은 반드시 **bag_workspace_gpdk045 폴더에 위치**
4. shell script 내부 환경변수를 **서버 환경에 맞게 수정**

---

## 4) Node.js 패키지 설치

이미 대부분의 필수 패키지가 포함되어 있으나, 에러가 나면 아래 명령으로 설치한다.

```bash
cd laygo_web_console/Implementation_linux/server
npm install
```

모듈이 개별적으로 필요할 경우:

```bash
npm install <모듈명>
```

---

## 5) 로컬 MongoDB 설치

Webconsole은 MongoDB를 사용한다.
→ **Local MongoDB** 또는 **MongoDB Atlas** 중 하나만 사용해야 하며, 두 개를 동시에 사용하면 충돌한다.

### ✔ MongoDB Community Edition 설치 (Ubuntu)

공식 문서를 참고해 아래 절차를 따른다:

1. MongoDB GPG key 등록
2. MongoDB 공식 repository 추가
3. apt로 MongoDB 설치
4. 서비스 활성화

공식 문서:

* 전체 설치 가이드
  [https://www.mongodb.com/docs/manual/administration/install-community/](https://www.mongodb.com/docs/manual/administration/install-community/)
* Ubuntu 버전 Korean 문서
  [https://www.mongodb.com/ko-kr/docs/manual/tutorial/install-mongodb-on-ubuntu/](https://www.mongodb.com/ko-kr/docs/manual/tutorial/install-mongodb-on-ubuntu/)

### ✔ 서비스 상태 확인

```bash
sudo systemctl status mongod
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

## 5-1) MongoDB 주소 설정 (.env & shell script)

### 로컬 MongoDB 사용 시:

`.env`

```env
DB_CONNECT = mongodb://localhost:27017
```

`start_bag_test.sh` 내에서도 동일하게:

```bash
export DB_CONNECT="mongodb://localhost:27017"
```

### Atlas 사용 시:

```env
DB_CONNECT = mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```

---

## 6) 메일 발송 설정 (Naver SMTP)

비밀번호 초기화 등 이메일 기능을 위해 SMTP 설정이 필요하다.

### 설정 절차

1. 네이버 보안 설정에서 **2단계 인증 활성화**
2. **애플리케이션 비밀번호 생성**
3. 생성된 비밀번호를 `.env`에 입력

공식 문서:
[https://help.naver.com/](https://help.naver.com/)

---

## 7) 환경 변수 (.env) 설정

파일 위치:

```
laygo_web_console/Implementation_linux/server/.env
```

내용 예시:

```env
# Database
DB_CONNECT = mongodb://localhost:27017
JWT_SECRET = <랜덤 문자열>

# Mailer
NAVER_USER = <ID>@naver.com
NAVER_PASS = <Naver 애플리케이션 비밀번호>

# TLS (필요한 경우)
NODE_TLS_REJECT_UNAUTHORIZED = '0'

# Laygo 경로
LAYGO_DIR = /WORK/bag_workspace_gpdk045

# Server
PORT = 3000
HOST = 0.0.0.0
NODE_ENV = production
```

---

## 8) 포트 개방 확인

```bash
sudo lsof -i :3000
sudo netstat -tulnp | grep 3000
sudo ufw allow 3000/tcp   # 방화벽 사용 시
```

---

## 9) Webconsole 서버 실행

```bash
cd laygo_web_console/Implementation_linux/server
PORT=3000 HOST=0.0.0.0 pm2 start app.js --name webconsole --update-env
```

---

## 10) 접속 방법

브라우저에서:

```
http://<서버IP>:3000
```

---

# ⚙️ 2. Webconsole 운영 (PM2 관리)

### 상태 확인

```bash
pm2 ls
pm2 logs webconsole
```

### 실행

```bash
pm2 start webconsole
```

### 중지

```bash
pm2 stop webconsole
```

### 삭제

```bash
pm2 delete webconsole
```

### 재부팅 후 자동 실행

```bash
pm2 save
pm2 startup systemd
# 출력되는 명령어를 sudo로 실행
```







