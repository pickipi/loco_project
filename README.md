<div>
  <div align="center">
    <img src="https://github.com/user-attachments/assets/6c2f9885-eef7-48e6-8d70-060a0e57303c" width="250" height="250">
    <h1> 로코 (LoCo)</h1> 
    <h2>📍Location(공간) + 💫Connect(연결)</h2>
    </br>
    <h3> 💡"공간을 잇고, 가치를 나누다" </h3>
    <h4> 도심 속 유휴 공간과 이를 필요로 하는 사용자들을 매칭하는 공간 기반 공유 서비스 </h4>
  </div>
<!--   <h4> 사이트 URL: https://www.momentree.site/ </h4> -->
</div>

![LoCo_Template](https://github.com/user-attachments/assets/12cb4f67-9df1-4527-b7f7-cf26287a19d1)
---

# 목차
1. 프로젝트 개요
2. 팀 소개
3. 기술 스택
4. 프로젝트 구조도
5. 실행 방법
6. 시연
7. 회고
---

# 1. 💫프로젝트 개요
- 프로젝트 이름: 로코 (LoCo)
- 프로젝트 설명: 공간을 잇고, 가치를 나누다
---

# 2. 🦁팀원 및 팀 소개
| 김동규 | 노봉준 | 최종민 | 이호준 |
|:------:|:------:|:------:|:------:|
| <img src="https://github.com/user-attachments/assets/85be774d-53a3-4a26-9df4-bdd2a7d2f012" alt="김동규" width="150"> | <img src="https://github.com/user-attachments/assets/3236f1aa-4dd0-412c-9772-2d4b84e5b5e0" alt="노봉준" width="150"> | <img src="https://github.com/user-attachments/assets/d9e5279c-5c88-4c83-8a23-c06f7367a079" alt="최종민" width="150"> | <img src="https://github.com/user-attachments/assets/e2736555-bc1c-487b-9014-571fdce5cfbb" alt="이호준" width="150"> 
| Product Manager | Dev Lead | BE/FE | BE/FE |
| [GitHub](https://github.com/Morgan-EE) | [GitHub](https://github.com/pickipi) | [GitHub](https://github.com/Jong-min-choi) | [GitHub](https://github.com/dlghwns200) |
| [Blog](https://mmatrix.tistory.com/) | [Blog](https://lefton.tistory.com/) | [Blog]() | [Blog]() |
---

## 2-1. ☑️작업 분담
|  |  |  |
|-----------------|-----------------|-----------------|
| <div align="center">이름</div> | <div align="center">프로필</div> | <div align="center">담당 작업</div> |
| <div align="center">김동규(팀장)</div> | <img src="https://github.com/user-attachments/assets/85be774d-53a3-4a26-9df4-bdd2a7d2f012" alt="김동규" width="100"> | <ul><li>프로젝트 계획 및 관리</li><li>팀 리딩 및 커뮤니케이션</li><li>유저 회원가입 및 로그인 담당<li>카카오 소셜 로그인 담당</li></ul> |
| <div align="center">노봉준(부팀장)</div> | <img src="https://github.com/user-attachments/assets/3236f1aa-4dd0-412c-9772-2d4b84e5b5e0" alt="노봉준" width="100"> | <ul><li>저장소 관리 및 Git 협업 관리</li><li>관리자 관련 담당</li><li>호스트 관련 담당</li><li>게시글 및 댓글 관련 담당</li>  </ul> |
| <div align="center">최종민</div> | <img src="https://github.com/user-attachments/assets/d9e5279c-5c88-4c83-8a23-c06f7367a079" alt="최종민" width="100"> |<ul><li>결제 담당</li><li>예약 담당</li><li>평점 담당</li></ul> |
| <div align="center">이호준</div> | <img src="https://github.com/user-attachments/assets/e2736555-bc1c-487b-9014-571fdce5cfbb" alt="이호준" width="100"> | <ul><li>공간 관련 담당 </li><li> 채팅 담당 </li><li> 즐겨찾기 담당 </li></ul> |
---
# 3. 🔩기술 스택

| 분류         | 기술 |
|--------------|------|
| <div align="center">**FRONTEND**</div> | Next.js, Thymeleaf|
| <div align="center">**BACKEND**</div>  | Spring Boot, Spring Security, JPA, Swagger |
| <div align="center">**INFRA**</div>    | AWS EC2, S3, Docker, Nginx, Terraform, CI/CD |
| <div align="center">**API**</div>      | Kakao Login, KaKao Maps, Toss Payments, Gmail API, Redis |
| <div align="center">**ETC**</div>      | WebSocket, MySQL |
---
# 4. 프로젝트 구조도
## ERD
![LoCo_ERD](https://github.com/user-attachments/assets/297c1b43-1876-4416-91b4-410d89a04791)


## 아키텍처
![image](https://github.com/user-attachments/assets/dd44448c-244a-4cb3-a9cb-a2d42d1b7221)


# 5. 실행 방법 (Git Bash 기준)
## 💡프론트엔드
### frontend 경로 이동
```bash
cd frontend
```
### npm 설치
```bash
npm install
```
### npm 실행
```bash
npm run dev
```
---
## 💡백엔드
### backend 디렉토리에서 빌드 진행
```bash
cd backend
./gradlew clean build
```
or
```bash
./gradlew build
```
### 실행 파일 (jar)이 있는 디렉토리로 이동 및 jar 파일 실행
```bash
cd backend/build/libs
java -jar loco_project-0.0.1-SNAPSHOT.jar
```
![image](https://github.com/user-attachments/assets/b3575b46-e746-4181-8dd2-fa06064f46a2)

# 6. 시연
[LoCo 시연 영상](https://www.youtube.com/watch?v=dQzQO2KjDYg&ab_channel=%EA%B9%80%EB%AA%A8%EA%B1%B4)

# 7. 회고
![image](https://github.com/user-attachments/assets/67b338c4-d1bb-42bd-b1e3-76f3bb61aecf)

