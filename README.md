# Laygo Interactive Webconsole

Laygo Webconsole은 **Laygo 기반 회로 설계/배치 자동화**를 웹 환경에서 실행할 수 있도록 만든 관리 도구이다.
Node.js와 PM2를 기반으로 동작하며, MongoDB를 연동해 사용자/프로젝트 데이터를 관리한다.

---


## 📂 프로젝트 구조


```bash
laygo_web_console/
├── Design/ # 서버 구성요소 분석 (JS, EJS, CSS 등)
│ # 내부 함수 동작, 추가 요구사항 문서화
│
├── Implementation/ # 리눅스 서버 이전 전 사용된 통합 Webconsole 서버
│
├── Implementation_linux/ # 현재 리눅스 서버에서 사용하는 Webconsole 서버
│
├── jeyun/ # 개발자 개인 workspace (jeyun)
│
├── sehoon/ # 개발자 개인 workspace (sehoon)
│
├── Test/ # 테스트 코드 및 실험용 디렉토리
│
└── README.md # 설치/사용 가이드 문서
```

📌 **폴더 설명**
- **Design/**: 서버 각 구성요소(JS, EJS, CSS 등)의 동작 방식 분석 및 요구사항 정리
- **Implementation/**: 리눅스 서버 이전 버전 (통합 Webconsole 서버)
- **Implementation_linux/**: 리눅스 서버에서 사용되는 현재 Webconsole 서버
- **jeyun/**, **sehoon/**: 각 개발진의 개인 workspace
- **Test/**: 테스트 및 실험용 디렉토리
- **README.md**: 설치/사용 가이드

---


## 🚀 초기 세팅

### 1) Node.js & PM2 설치
```bash
# Node.js 설치 (nvm 사용)
nvm install 20
nvm use 20
nvm alias default 20

# PM2 설치
npm i -g pm2
```

**버전 확인**

```bash
node -v   # v20.x
npm -v
pm2 -v
```

---

### 2) Webconsole 코드 가져오기

`bag_workspace_gpdk045` 디렉토리와 같은 경로에서 실행:

```bash
git clone https://github.com/sehoon120/laygo_web_console.git laygo_web_console
```

---

### 3) Laygo 코드 변경 반영

`laygo_web_console/Implementation_linux/Laygo/` 디렉토리에
**수정된 파일 모음**이 있음. 해당 변경사항을 기존 Laygo 코드에 반영해야 한다.

이외에 laygo2_tech/core.py, flex.py에서 tech_fname 변수를 아래와 같이 변경했다.
base_dir = os.path.dirname(os.path.abspath(__file__))
tech_fname = os>path.join(base_dir, 'lago2_tech.yaml')

---

### 4) 패키지 설치

```bash
cd laygo_web_console/Implementation_linux/server
npm install
```

---

### 5) 환경 변수 설정

`server/.env` 파일 생성:

```env
# Database
DB_CONNECT = mongodb+srv://<copy_connection_code>
JWT_SECRET = <랜덤 문자열>

# Mailer (네이버 계정)
NAVER_USER = <ID>@naver.com
NAVER_PASS = <앱 비밀번호 또는 보안코드>

# TLS
NODE_TLS_REJECT_UNAUTHORIZED = '0'

# Laygo 경로 (배포 환경에 맞게 수정)
LAYGO_DIR = /WORK/bag_workspace_gpdk045

# 서버 설정
PORT = 3000
HOST = 0.0.0.0
NODE_ENV = production
```

---

### 5.5) 포트 확인 (선택 사항)

3000 포트가 열려 있는지 확인하는 방법:

```bash
# 리눅스에서 포트 확인
sudo lsof -i :3000

# 또는 netstat 사용
sudo netstat -tulnp | grep 3000

# 방화벽 설정 (예: ufw 사용 시)
sudo ufw allow 3000/tcp
```

---

### 6) Webconsole 최초 실행

```bash
PORT=3000 HOST=0.0.0.0 pm2 start app.js --name webconsole --update-env
```

---

### 7) 서버 접속

브라우저에서 접속:

```
http://<서버IP>:3000
```

---

## ⚙️ Webconsole 관리 (on/off)

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

### 재부팅 시 자동 시작

```bash
pm2 save
pm2 startup systemd
# 안내 문구를 복사하여 sudo로 실행
```

---

## 📌 참고

* `bag_workspace_gpdk045` 와 같은 경로에서 clone해야 Laygo 연동이 원활하다.
* `.env` 파일은 절대 Git에 push를 금지한다. (`.gitignore` 등록 권장)



