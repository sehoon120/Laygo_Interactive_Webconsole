const asyncHandler = require('express-async-handler');
const File = require('../models/fileModel');
const multer = require('multer');
const fs = require('fs');
const fsp = require('fs/promises');    // 프로미스 기반 (await 사용 가능)

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { exec } = require('child_process');
const path = require('path');
const os = require('os');

const tempYamlDir = path.join(__dirname, '../../temp_yaml');
const yaml = require('js-yaml');
const { spawn } = require('child_process');
const { getSystemErrorMap } = require('util');

// ==================================================

const getAllContacts = asyncHandler(async (req, res) => {
    const currentPath = req.query.path || '/';  //
    
    File.find({ 
        user: req.user.username
        , filePath: currentPath //
    })
    .sort({ updatedAt: -1 })  // updatedAt 필드를 기준으로 내림차순 정렬
    .then(files => {
        res.render('getallfiles', { files, currentPath });
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('파일 데이터를 불러오는 중 오류가 발생했습니다.');
    });
    
});

// ==================================================

// add file
// GET  /add
const addContactForm = (req, res) => {
    const currentPath = req.query.path || '/';
    res.render('add', { currentPath: currentPath });
}

const createContact = asyncHandler(async (req, res) => {
    const { filename, filetype } = req.body;
    if (!filename || !filetype) {
        return res.send('essential data is not written');
    }
    //잘못된 name 입력 필터링
    if(/.*\..*/.test(filename) || RegExp('.*\/.*').test(filename)) {
      return res.send('파일 이름이 잘못되었습니다.');
    }
    const currentPath = req.query.path || '/';
    // 기본 파일 데이터를 구성합니다.
    let fileData = {
        user: req.user.username,
        filename: filename,
        filetype: filetype,
        filePath: currentPath
    };
    // 파일 업로드가 있는 경우 파일 내용을 읽어옵니다.
    if (req.file) {
        // 메모리 스토리지를 사용하는 경우 req.file.buffer가 존재합니다.
        if (req.file.buffer) {
            fileData.content = req.file.buffer.toString('utf8');
        }
        // 디스크 스토리지를 사용하는 경우 파일 경로를 통해 읽어옵니다.
        else if (req.file.path) {
            fileData.content = fs.readFileSync(req.file.path, 'utf8');
        }
    }
    const file = await File.create(fileData);
    res.redirect('/main?path=' + encodeURIComponent(currentPath));
});

// ==================================================

// change file
// GET  /:id
const getContact = asyncHandler(async (req, res) => {
    const file = await File.findById(req.params.id);
    const currentPath = req.query.path || '/';
    res.render('update', { file: file, currentPath: currentPath});

});


// change file name
// PUT
const updateContact = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { name, type, path } = req.body;
    const currentPath = req.query.path || '/';
    const file = await File.findById(id);
    if (!file) {
        throw new Error('File not found.');
    }

    //path 마지막에 / 안 붙은 경우 붙임.
    const path_modified = (path[path.length-1] === '/')?path:path+'/';
    //잘못된 name 입력 필터링
    if(/.*\..*/.test(name) || RegExp('.*\/.*').test(name)) {
      res.status(500).send('파일 이름이 잘못되었습니다.');
    }
    else {
      //새로운 경로 입력 시 해당 경로의 dir들 생성
      const path_chunks = path_modified.split("/");
      console.log(path_chunks);
      for (let i =0; i<path_chunks.length-2; i=i+1){
        let partial_path = '';
        for(let j = 0; j<=i; j++){
          if(path_chunks[j] === ''){
            partial_path += '/';
          } else{
            partial_path += path_chunks[j] + '/';
          }
        }
        partial_path = (partial_path === '') ? '/' : partial_path;
        //console.log(partial_path);
        //console.log(path_chunks[i+1]);
        let dirExist = null;
        dirExist = await File.exists({
          user: req.user.username,
          filePath: partial_path,
          filetype: 'dir',
          filename: path_chunks[i+1]
        });
        if(dirExist){
          //console.log("dir exists");
        } else {
          //console.log("no such dir");
          File.create({
            user: req.user.username,
            filePath: partial_path,
            filetype: 'dir',
            filename: path_chunks[i+1]
          })
        }
      }

      // 기존 디렉토리의 전체 경로 (예: '/4/train/test_dir/')
      const oldDirFullPath = file.filePath + file.filename + '/';
      // 현재 파일 또는 디렉토리 업데이트
      file.filename = name;
      file.filetype = type;
      file.filePath = path_modified;
      await file.save();

      // 디렉토리일 경우, 하위 파일 및 디렉토리 경로 업데이트 (현재 사용자와 관련된 파일만)
      if (file.filetype === 'dir') {
          // 새 이름으로 변경 후 전체 경로 (예: '/4/train/abcd/')
          const newDirFullPath = file.filePath + name + '/';

          // 현재 로그인한 사용자(req.user.username)에 해당하는 하위 파일/디렉토리만 업데이트
          const children = await File.find({
              filePath: { $regex: '^' + oldDirFullPath },
              user: req.user.username
          });
          for (let child of children) {
              child.filePath = child.filePath.replace(oldDirFullPath, newDirFullPath);
              await child.save();
          }
      }
      res.redirect('/main?path=' + encodeURIComponent(currentPath));
    }

    
});





// delete file
// DEL
const deleteContact = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const file = await File.findById(id);
    if(file.filetype === 'dir') {
      const dirFullPath = file.filePath + file.filename + '/';
      await File.deleteMany({
          filePath: { $regex: '^' + dirFullPath },
          user: req.user.username
      });
    }
    await File.findByIdAndDelete(id);
    const currentPath = req.query.path || '/';
    res.redirect('/main?path=' + encodeURIComponent(currentPath));

});

// ==================================================

// edit file
// GET
const editFile = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const file = await File.findById(id);
    const currentPath = req.query.path || '/';
    const userDir = path.join(tempYamlDir, req.user.username);

    // 파일 타입이 디렉토리라면
    if (file.filetype === 'dir') {
        const newPath = currentPath + file.filename + '/';
        // 메인 페이지로 리다이렉트 시 새 경로를 쿼리 파라미터로 전달
        return res.redirect('/main?path=' + encodeURIComponent(newPath));
    }

    // 파일 타입이 디렉토리가 아니라면 수정 페이지로 렌더링
    res.render('edit', { file: file, currentPath: currentPath, drawObjectDoc: {}, cellname: 'dummyCell' });
});

// Save & Generate: PUT /main/:id/edit?_method=PUT&path=...

//===============================================
//New version of saveFile and drawLayout function
const saveFile = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { content, generate } = req.body;

  const file = await File.findById(id);
  if (!file) {
    return res.status(404).json({ error: 'File not found.' });
  }

  // 0) 항상 먼저 저장
  file.content = content;
  await file.save();

  // generate 스위치가 꺼져있으면 여기서 종료 (일관된 응답 필드)
  if (generate !== 'on') {
    return res.json({
      success: true,
      message: 'Saved only (no generation)',
      output: '',
      drawObjectDoc: null,
      cellname: req.body.cellname ?? null,
      libname: null,
    });
  }

  // py 아니면 generate 시켜도 저장만 하고 종료
  if (file.filetype !== 'py') {
    return res.json({
      success: true,
      message: 'Saved only (no generation)',
      output: '',
      drawObjectDoc: null,
      cellname: req.body.cellname ?? null,
      libname: null,
      fileTypeIsPy: false
    });
  }

  // 1) 준비 -> temp_code, temp_yaml dir 생성: laygo에서의 기능과 겹치기도 함. 둘 중 하나 제거 가능
  const username = (req.user && req.user.username) ? req.user.username : 'guest';
  const baseName = file.filename.replace(/\.[^/.]+$/, ''); // 확장자 제거
  const tempCodeDir = path.join(__dirname, '../../temp_code');
  const tempYamlRoot = path.join(__dirname, '../../temp_yaml');
  if (!fs.existsSync(tempCodeDir)) fs.mkdirSync(tempCodeDir, { recursive: true });

  // 임시 코드 파일(Ubuntu 경로)
  const tempFile = path.join(tempCodeDir, `${username}_${baseName}_temp.py`);
  fs.writeFileSync(tempFile, content, 'utf8');

  // YAML 경로 설정
  if (!fs.existsSync(tempYamlRoot)) fs.mkdirSync(tempYamlRoot, { recursive: true });
  const userYamlDir = path.join(tempYamlRoot, username);
  if (!fs.existsSync(userYamlDir)) fs.mkdirSync(userYamlDir, { recursive: true });

  //const yamlBase = req.body.yamlFile ? `${req.body.yamlFile}_templates.yaml` : 'logic_generated_templates.yaml';
  const libname = req.body.yamlFile ? req.body.yamlFile : 'logic_generated';
  const targetYamlDir = path.join(userYamlDir, libname); // 우리가 우선적으로 읽으려는 파일

  //Added by me
  const runDir = path.join(__dirname, '..');

  // 2) 스크립트 실행 (spawn 권장)
  const scriptWSL = process.env.LAYGO_DIR + '/start_bag_test.sh';
  const cmd = 'bash';
  // -lc: 로그인 쉘 + 명령 문자열, 인자에 공백 안전하게 따옴표
  const args = [
    '-lc',
    `"${scriptWSL}" "${username}" "${baseName}" "${tempFile}" "${runDir}"`
  ];
  const child = spawn(cmd, args, { shell: false });

  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (d) => { stdout += d.toString(); });
  child.stderr.on('data', (d) => { stderr += d.toString(); });

  child.on('close', async (code) => {
    // 임시 파일 제거 (실패해도 진행)
    fs.unlink(tempFile, () => {});
    if (code !== 0) {
      console.log(`Process exited with code ${code}`);
      return res.status(500).json({ success: false, error: stderr || `Process exited with code ${code}` });
    }

    // 최종 doc 로드 (타겟 YAML 우선) => 일단 제거
    let doc = null;
    let targetYaml = null;
    if (fs.existsSync(targetYamlDir)) {
      try {
        const yamlFiles = fs.readdirSync(targetYamlDir)
          .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
          .map(f => path.join(targetYamlDir, f))
          .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
        targetYaml = yamlFiles[0] || null;
      } catch {}

      try {
        doc = yaml.load(fs.readFileSync(targetYaml, 'utf8'));
      } catch (e) {
        // YAML 파싱 실패 시 null 유지
      }
    }

    return res.json({
      success: true,
      output: stdout,
      drawObjectDoc: doc,
      cellname: req.body.cellname ?? null,
      libname
    });
  });
});


// ==================================================

const getLogFile = asyncHandler(async (req, res) => {
  const username = req.user && req.user.username;
  const id = req.params.id;
  const file = await File.findById(id);
  if (!file) {
    return res.status(404).json({ error: 'File not found.' });
  }
  
  // file.filetype이 'py'가 아니면 빈 로그 반환
  if (file.filetype !== 'py') {
    return res.json({ log: '' });
  }

  const filename = file.filename;
  const logFilePath = path.join(__dirname, '../temp', `${username}_${filename}_output.log`);

  try {
    const data = await fs.promises.readFile(logFilePath, 'utf8');
    res.json({ log: data });
  } catch (err) {
    console.error("로그 파일 읽기 에러:", err);
    res.status(500).json({ error: '로그 파일을 읽을 수 없습니다.' });
  }
});

// ====================================================================================================

// utils: 파이썬 코드에서 lib/cell 추출
function extractLibCellFromPy(pyContent) {
  const src =
    Buffer.isBuffer(pyContent) ? pyContent.toString('utf8') :
    (typeof pyContent === 'string' ? pyContent : '');

  if (!src) return { lib: null, cell: null };

  const rxLib  = /libname\s*=\s*['"]([^'"]+)['"]/;
  const rxCell = /cellname\s*=\s*['"]([^'"]+)['"]/;
  const rxType = /cell_type\s*=\s*['"]([^'"]+)['"]/;
  const rxNf   = /nf\s*=\s*([0-9]+)/;

  let lib  = (src.match(rxLib)?.[1])  || null;
  let cell = (src.match(rxCell)?.[1]) || null;

  if (!cell) {
    const t = src.match(rxType)?.[1];
    const n = src.match(rxNf)?.[1];
    if (t && n) cell = `${t}_${n}x`;
  }
  return { lib, cell };
}

// 컨트롤러(draw 전용)
const drawLayout= asyncHandler(async (req, res) => {
  const id = req.params.id;
  const file = await File.findById(id);
  if (!file) return res.status(404).json({ error: 'File not found.' });

  // 1) 사용자 입력
  let lib = (req.body.libname || req.body.yamlFile || '').trim() || null;
  let cell = (req.body.cellname || '').trim() || null;

  // 2) 없으면 파이썬 코드에서 추출 (기존 유지)
  if (!lib || !cell) {
    const { lib: l2, cell: c2 } = extractLibCellFromPy(file.content || '');
    lib = lib || l2;
    cell = cell || c2;
  }

  const username = req.user?.username || 'guest';

  // 둘 중 하나라도 없으면 명시적으로 요청
  if (!lib || !cell) {
    return res.status(400).json({
      success: false,
      message: 'libname/cellname 미지정. 입력하거나 Save+Generate 후 다시 시도하세요.',
    });
  }

  // 3) 정확한 YAML 경로 구성: temp_yaml/<username>/<lib>/<cell>.yaml
  const userYamlRoot = path.join(__dirname, '../../temp_yaml', username);
  const unsafePath = path.join(userYamlRoot, lib, `${cell}.yaml`);
  const targetYaml = path.normalize(unsafePath);

  // 루트 이탈 방지
  if (!targetYaml.startsWith(path.normalize(userYamlRoot + path.sep))) {
    return res.status(400).json({ success: false, message: '잘못된 경로입니다.' });
  }

  // 4) YAML 읽기 (신규 포맷 전용)
  let doc = null;
  try {
    // access 체크 생략
    const raw = await fsp.readFile(targetYaml, 'utf8'); // 파일 없으면 여기서 throw
    doc = yaml.load(raw);
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: `YAML 파일을 읽을 수 없습니다: ${String(e)}`,
      sourceYamlPath: targetYaml,
      resolvedLibname: lib,
      resolvedCellname: cell,
    });
  }

  try {
    const raw = await fsp.readFile(targetYaml, 'utf8');
    doc = yaml.load(raw);

    // (선택) 서브블록 bbox 병합용 훅: 필요 시 백엔드에서 채워서 내려주기
    // doc.__libBBoxes = await buildLibBBoxMapIfNeeded(...);

    // 신규 포맷 검증(가벼운 체크)
    if (!doc || !doc.bbox || (!doc.metals && !doc.pins && !doc.subblocks)) {
      return res.status(422).json({
        success: false,
        message: '신규 YAML 포맷이 아니거나 필수 필드가 없습니다.',
        sourceYamlPath: targetYaml,
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: `YAML 파싱 실패: ${String(e)}`,
      sourceYamlPath: targetYaml,
    });
  }

  // 5) 응답 (프론트의 buildMap(cellObj) 바로 사용 가능)
  return res.json({
    success: true,
    drawObjectDoc: doc,
    resolvedLibname: lib,
    resolvedCellname: cell,
    sourceYamlPath: targetYaml,
  });
});


// ==================================================

module.exports = {
    getAllContacts, 
    createContact,
    getContact,
    updateContact,
    deleteContact,
    addContactForm,
    editFile,
    saveFile,
    getLogFile,
    drawLayout
};

