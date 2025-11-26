# logoutRoutes.md - 기본 기능
- /logout의 기능 route

- get method로 접근 시 logout 수행: 로그인 유지를 위한 쿠키를 clear후 /로 이동

- pseudocode
```
# router, multer 사용 설정

router.get('/', (req, res) => {
  res.clearCookie('쿠키 이름', { Option1: httpOnly: true, Option2: path: '/' (side_wide cookie임)});
  res.redirect('/');
});

```
