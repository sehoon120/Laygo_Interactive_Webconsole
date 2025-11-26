# LAYGO 수정사항

## 개요
- Web console 수정을 위한 laygo 코드 수정 내용 정리
- Laygo 함수 추가와 환경변수 수정이 필요
- PDK로 GPDK45를 사용하는 경우 기준으로 설정

## 환경변수 수정
- 서버 내에 저장된 bag_workspace_gpdk45의 자원들을 이용해 레이아웃을 생성한다.
- \bag_workspace_gpdk045\gpdk045\workspace_setup\.cshrc_bag 변경
    + setenv BAG_PYTHON "/TOOL/Anaconda/current/bin/python3.7" -> setenv BAG_PYTHON "/usr/bin/python3"
- \bag_workspace_gpdk045\gpdk045\laygo2_tech\core.py 변경
    + 서버 구현 시 실행 dir의 차이 때문에 tech_fname 경로 변경
    ```
    base_dir = os.path.dirname(os.path.abspath(__file__))
    tech_fname = os.path.join(base_dir, 'laygo2_tech.yaml')
    ```
- \bag_workspace_gpdk045\gpdk045\laygo2_tech\flex.py 변경
    + 서버 구현 시 실행 dir의 차이 때문에 tech_fname 경로 변경
    ```
    base_dir = os.path.dirname(os.path.abspath(__file__))
    tech_fname = os.path.join(base_dir, 'laygo2_tech.yaml')
    ```
- \bag_workspace_gpdk045\start_bag_test.sh 추가 (이후 이름 변경 예정)
    + Web console에서 layout의 생성을 위해 실행하는 script
    + Pseudocode
    ```
    # webconsole 환경 환경변수 설정
    export WC="webconsole" #WC가 정의되어 있는 경우 webconsole 환경으로 판단하고 동작하도록 laygo 수정
    export DB_CONNECT = "MongoDB URL"
    export LAYGO_USERNAME="$USERNAME"
    export LAYGO_BASENAME="$FILENAME"
    
    # $PYTHONPATH 설정 -> Laygo pakage들 import 위함
    export PYHONPATH = "서버내 bag_workspace_gpdk45 경로 : $PYTHONPATH"
    export PYHONPATH = "서버내 bag_workspace_gpdk45/laygo2 경로 : $PYTHONPATH"

    # 서버의 fileController에서는 스크립트 실행 인자로 순서대로 generate를 시도한 유저명(USERNAME), 실행한 파일명(FILENAME), Laygo script가 임시로 저장되어 있는 경로(CODE_PATH), Web console의 최상위 디렉터리(RUNDIR)를 준다.

    # laygo2로 username을 전달하는건 환경변수로 전달하는 방식으로 생각중 -> sehoon/ver3/.sh/start_bag_test.sh
    매 generate 실행마다 개별 프로세스를 사용하는 구조이기에 섞일 문제는 없을것

    # 로그 파일 생성
    make directory when there is no RUNDIR/temp
    LOG_FILE = RUNDIR/temp/USERNAME_FILENAME_output.log

    # 기타 실행 중 메시지 출력
    (생략)
    
    # 스크립트 실행 및 로그 저장
    {BAG_PYTHON or python3} CODE_PATH >> LOG_FILE
    ```

## Laygo에 web console용 출력 함수 추가
- 기존 LAYGO의 yaml export 메커니즘
    + laygo2.interface.yaml.export_template : Template object와 출력할 filename 받아 yaml로 출력 수행. Template을 dict로 변환 후 그것을 yaml로 출력. 
    + class laygo2.object.database.Design의 member function export_to_template : Design object를 NativeInstanceTemplate로 출력
        + 문제 1) Subblock의 출력 안 됨
        + Prototype에서의 수정 내역:  object/database.py line 1759 -> subblock에 virtual instance들도 추가
    + class laygo2.object.template.NativeInstanceTemplate의 member function export_to_dict : NativeInstanceTemplate을 python dict로 출력
        + libname, cellname, bbox, pins, masks, subblocks, metals 출력
        + Prototype에서의 수정 내역: subblock이 virtual instance일 경우 해당 virtual instance의 size와 pin을 추가해 export
        + 문제) metal 출력의 metal['xy']에 두께 데이터가 존재하지 않음
    + 두께 데이터(hextension, vextension)은 어디에 있는가?
        + 1) Routing 과정에서(RoutingGrid 클래스의 라우팅 관련 함수들-route() 등-에서) 생성 후 metal에 해당하는 Rect 객체에 담아 반환
        + 2) Routing 과정: Design 객체의 route 함수에서 RoutingGrid의 route 함수 호출해 metal 생성 후, 내부 리스트에 append해 저장
        + 3) 따라서, design.export_to_template에서 export 시 hextension / vextension을 포함하지 않는 것이 문제가 된다.
        + 4) Design.rect의 metal들에는 extension들이 포함되어 있다.
    + Skill, yaml export 코드 예시
```
        # 7. Export to physical database.
        print("Export design\n")
        laygo2.export(lib, tech=tech, filename=export_path_skill+libname+'_'+cellname+'.il')
        # Filename example: ./laygo2_generators_private/logic/skill/logic_generated_nand_2x.il
 
        # 8. Export to a template database file.
        nat_temp = dsn.export_to_template()
        laygo2.export_template(nat_temp, filename=export_path+libname+'_templates.yaml', mode='append')
        # Filename example: ./laygo2_generators_private/logic/logic_generated_templates.yaml
```

- 기존 YAML로의 export로 출력된 export data는 두께 데이터를 포함하고 있지 않으며, 따라서 draw를 위해 추가가 필요하다.
- 수정 함수 1: laygo2.interface.yaml.export_template()
    + MongoDB에 저장된 template database 파일로 출력되도록 해야 함(Local directory가 아니라) 
    + Issue 1) Web console에서의 접근과 단순 local에서의 접근의 구분방법: Laygo 환경변수에 WebConsole 환경 여부를 포함시키고, import_template 함수에서는 이 환경변수를 확인해 webconsole 환경인 경우 DB에서 정보를 읽어옴
    + Issue 2) MongoDB atlas 접근: https://ohnyong.tistory.com/35
- 수정 함수 2: laygo2.interface.core.export()
    + Export target에 webconsole 추가: webconsole.py의 export(추가 함수 1) 호출, username을 환경변수에서 추출
    + 추가 내용
    ```
    elif target == 'webconsole':  # webconsole export
        consoleUsername = os.environ['LAYGO_USERNAME']
        
        return webconsole.export(
            db=db,
            username = consoleUsername,
            tech = tech
        )
    ```

- 추가 함수 1: laygo2.interface.webconsole.export()
    + 출력을 위한 파일 생성(각 Laygo 스크립트별로 할당된 YAML 파일) 수행
    + 입력: db: "laygo2.object.database.Library", cellname: str = None
    + 출력: 서버에 WebConsole 출력을 위한 yaml 파일 저장
    + 관련 정보: libaray에 design을 append할 경우, library 아래의 element dictionary에 design이 들어가게 됨
    + Pseudocode
    ```
    function export(db, username, cellname) {
        For element in  db.elements {
            temp_dictionary = element.export_to_dict_with_extension();
            Write_yaml(temp_dictionary, path=../laygowebconsole/temp/USRNAME/SCRIPTNAME/cellname.yaml)
        }
    }
    ```
    + 추가 문제: Username과 Scriptname은 어디서 받지?
        + 프로세스별로 환경변수를 다르게 줄 수 있으므로 그렇게 한다.
    + Pseudocode: start_bag.sh(현재 start_bag_test.sh) 수정
    ```
    (line30) ${BAG_PYTHON:-python3} "$CODE_PATH" "$USERNAME" "$FILENAME" >> "$LOG_FILE" 2>&1
    ```

- 추가 함수 2: Design.export_to_webconsole() -> Skeleton 구현 완료(에러 테스트 필요) 8/19
    + Laygo2.object.database.py Design 객체의 함수 추가
    + Design.export_to_template과 NativeInstanceTemplate.export_to_dict() 참고


- export_to_raw_dict를 추가함수2 대신 사용가능할지 확인중 -> subblock의 size가 포함되지 않아 MOS의 drawing 불가능, 이를 수정하여 export_to_webconsole 만들겠음

## Laygo script에 templete database import 함수 수정
- 기존 방식의 문제점: local에 존재하는 template database 디렉터리의 위치를 알아야 import가 가능 -> 다른 유저의 디렉터리에 대한 접근도 가능해질 수 있다. 서버 내의 디렉터리 구조를 알아야 한다는 전제가 있다.
- 수정 목표: /main에 보이는 유저의 DB 내 디렉터리 구조 내에 template database를 저장할 수 있다. 해당 디렉터리 구조 내의 주소로 template DB 접근 가능하게 함.
- 수정 대상 함수: laygo2.interface.yaml.py 의 import_template()
    + Issue 1) Web console에서의 접근과 단순 local에서의 접근을 어떻게 구분하지?
        + 가능하면 새 함수를 정의하지 않는 방식. 오버로딩 안되나? -> Python은 오버로딩이 불가능할뿐더러 매개변수가 다르지도 않음
        + Laygo 환경변수에 WebConsole 환경 여부를 포함시키고, import_template 함수에서는 이 환경변수를 확인해 webconsole 환경인 경우 DB에서 정보를 읽어옴
    + Issue 2) MongoDB atlas 접근: https://ohnyong.tistory.com/35
- 입력 추가: username 받아야 함
- 구현 완료: Laygo2 디렉터리 확인해 최종 반영만 남음


## 이와 같이 Design 된 경우에 대한 스크립트 작성 예시
```
export_path = "Location on DB server"
libname = "libname"
# import from templete database
laygo2.import_template(filename=export_path+'logic_generated_templates.yaml') 

# Export to physical database.
print("Export design\n")
laygo2.export(lib, tech=tech, filename=libname+'_'+cellname+'.yaml', target='webconsole')             # Export to webconsole.
 
# 8. Export to a template database file.
nat_temp = dsn.export_to_template()
laygo2.export_template(nat_temp, filename=export_path+libname+'_templates.yaml', mode='append')                         # Same as local execution
# Filename example: ./laygo2_generators_private/logic/logic_generated_templates.yaml

```


## Quick view: 수정/작성된 함수 최종 정리
- 위에 읽기 힘들면 이거보세요.
- laygo2.interface.yaml.export_template()
    + template database를 DB로 출력/입력

- laygo2.interface.core.export() 수정

- laygo2/interface에 webconsole.py 추가
    + export()함수 정의 -> 출력용 yaml 로컬/서버 저장

- laygo2.object.database.Design 객체에 export_to_webconsole() member 함수 추가
    + dict 형태로 출력할 데이터 반환

- laygo2.interface.yaml.import_template() 수정
    + Webconsole 환경에서는 DB에서 template 읽어오도록 수정

- start_bag_test.sh 추가(이후 단계에서 start_bag 대체) => 서버 옮기면 변수 WC 꼭 수정!!!
