````markdown
# Laygo Webconsole 사용 가이드

## 1. 초기 세팅

### 1) Node.js & PM2 설치
```bash
# Node.js 설치 (nvm 사용)
nvm install 20
nvm use 20
nvm alias default 20

# PM2 설치
npm i -g pm2
````

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

`laygo_web_console/Implementation_linux/Laygo/` 디렉토리에 **수정된 파일 모음**이 있음.
해당 변경사항을 기존 Laygo 코드에 반영해야 함.

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

## 2. Webconsole 관리 (on/off)

### 1) 상태 확인

```bash
pm2 ls
pm2 logs webconsole
```

### 2) 실행

```bash
pm2 start webconsole
```

### 3) 중지

```bash
pm2 stop webconsole
```

### 4) 삭제

```bash
pm2 delete webconsole
```

### 5) 재부팅 시 자동 시작

```bash
pm2 save
pm2 startup systemd
# 안내 문구를 복사하여 sudo로 실행
```