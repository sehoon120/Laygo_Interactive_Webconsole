# bag_workspace_gpdk45/start_bag.sh 대신 사용할 것
# ================================================== 임의 추가
#!/usr/bin/env bash

# 우분투 터미널 기준
export PYTHONPATH="/mnt/c/For_english_only_directories/LaygoWebConsole/bag_workspace_gpdk045:$PYTHONPATH"
export PYTHONPATH="/mnt/c/For_english_only_directories/LaygoWebConsole/bag_workspace_gpdk045/laygo2:$PYTHONPATH"
export WC="/mnt/c/For_english_only_directories/LaygoWebConsole/laygo_web_console/Implementation/temp_yaml"
export DB_CONNECT="mongodb+srv://testjy:SkLXpEKwxl7uaQKc@cluster0.y07fyca.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
unset SESSION_MANAGER

# 우분투 콘다 Laygo 경로
#BAG_PYTHON="/home/happy/anaconda3/envs/Laygo/bin/python3.7"
#

USERNAME="$1"   #User of webconsole
FILENAME="$2"   #Filename(with path and without extension) of script
CODE_PATH="$3"  #Location of temporal script file for execution
RUNDIR="$4";    #Location of server

export LAYGO_USERNAME="$USERNAME"
#export LAYGO_BASENAME="$FILENAME"           

# 로그 생성버전
# 로그 디렉토리 만들기
#mkdir -p ${RUNDIR}/temp
#mkdir -p /mnt/c/For_english_only_directories/LaygoWebConsole/laygo_web_console/jeyun/testbed/temp
LOG_FILE="${RUNDIR}/temp/${USERNAME}_${FILENAME}_output.log"
#LOG_FILE="/mnt/c/For_english_only_directories/LaygoWebConsole/laygo_web_console/jeyun/testbed/temp/testlog.log"
# 실행
echo "[INFO] 실행 중: $CODE_PATH" > "$LOG_FILE"
echo "[DEBUG] 현재실행경로: " >> "$LOG_FILE"
pwd >> "$LOG_FILE"
echo "USERNAME: $USERNAME" >> "$LOG_FILE"
echo "FILENAME: $FILENAME" >> "$LOG_FILE"
echo "RUNDIR: $RUNDIR" >> "$LOG_FILE"

# 디버깅 로그
# echo "[DEBUG] Which python: $(which "$BAG_PYTHON")" >> "$LOG_FILE"
# echo "[DEBUG] Python version: $("$BAG_PYTHON" --version)" >> "$LOG_FILE"
# echo "[DEBUG] Laygo2_tech import test:" >> "$LOG_FILE"
# "$BAG_PYTHON" -c "import laygo2_tech; print('laygo2_tech import OK')" >> "$LOG_FILE" 2>&1
# echo " " >> "$LOG_FILE"
# echo " " >> "$LOG_FILE"
# echo " " >> "$LOG_FILE"
${BAG_PYTHON:-python3} "$CODE_PATH" >> "$LOG_FILE" 2>&1


# 로그 삭제버전
# ${BAG_PYTHON:-python3} "$CODE_PATH"

exit 0