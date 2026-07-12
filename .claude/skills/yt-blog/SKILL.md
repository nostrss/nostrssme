---
name: yt-blog
description: 유튜브 영상 자막을 추출해 apps/blog/data/blog 에 한국어 기술 블로그 글(MDX)을 작성한다. 유튜브 URL 과 함께 블로그 작성을 요청하면 사용. Trigger: /yt-blog <youtube-url>
---

# 유튜브 영상 → 블로그 글

유튜브 URL 을 받아 자막을 추출하고, 영상 내용을 정리한 한국어 블로그 글을 작성한다.

## 1. 메타데이터와 자막 추출

영상 ID(`VIDEO_ID`)를 URL 에서 뽑은 뒤:

```bash
# 메타데이터 (--print 는 시뮬레이트 모드라 자막 다운로드와 함께 쓰면 안 됨 — 반드시 분리 실행)
pipx run yt-dlp --skip-download --print "%(title)s | %(channel)s | %(upload_date)s | %(duration)s초" "https://www.youtube.com/watch?v=VIDEO_ID"

# 자동 자막 다운로드 (스크래치패드 디렉토리에서 실행)
pipx run yt-dlp --skip-download --write-auto-sub --sub-lang "en" --sub-format json3 -o "video" "https://www.youtube.com/watch?v=VIDEO_ID"
```

json3 → 텍스트 변환:

```bash
python3 -c "
import json
with open('video.en.json3') as f:
    d = json.load(f)
words = []
for ev in d.get('events', []):
    for seg in ev.get('segs', []) or []:
        t = seg.get('utf8', '')
        if t.strip():
            words.append(t.strip())
print(' '.join(words))
"
```

자동 자막이라 오탈자가 있다 — 문맥으로 보정하고, 화면 코드는 직접 못 본 것이므로 코드 예시는 자막 기반 재구성임을 사용자에게 한 번 알린다.

## 2. 글 작성

파일: `apps/blog/data/blog/YYMMDD-<slug>.mdx` (오늘 날짜, slug 는 영어 kebab-case)

frontmatter:

```yaml
---
title: '한국어 제목 — (원제 시리즈명)'
date: 'YYYY-MM-DDT10:00:00'   # 같은 날 글이 이미 있으면 시간을 한 시간씩 미룸
tags: ['typescript', 'til', '원작자-이름']   # 소문자 kebab-case, 유튜브 원작자/채널 이름 태그 필수
draft: true                    # 초안은 항상 true 로 시작
summary: '한국어 요약 — 문제와 해법을 2~3문장으로'
images:
  - 'https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg'   # 유튜브 썸네일
---
```

본문 구조:

```markdown
[![영상 제목](https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)

> 출처: [영상 원제](영상 URL) — 원작자. 영상의 내용을 기록으로 남겨두기 위해 블로그로 작성했다.

## 문제 — ...        # 영상이 제기한 문제를 코드와 함께
## 해결 — ...        # 핵심 아이디어를 단계별로, 코드 예시 포함
## (디테일 섹션)      # 영상 속 부가 팁이 있으면
## 언제 쓰면 좋을까    # "프론트엔드에서" 처럼 한정하지 말 것
### 프론트엔드        # 실무 예시 2~3개, 각각 짧은 코드
### 백엔드           # 실무 예시 2~3개, 각각 짧은 코드
## 정리              # 불릿 3~4개
```

스타일: 기존 글(`apps/blog/data/blog/`)의 어조를 따른다 — 평어체(~다), 코드 중심, 조사 앞 영단어 뒤 띄어쓰기(`payload 가`).

## 3. 리뷰 → 발행

1. `draft: true` 상태로 작성하고 사용자 검토를 받는다
2. 사용자가 발행을 요청하면 `draft: false` 로 변경
3. `/git-commit` 컨벤션으로 커밋 — `feat(blog): <글 주제> 글 추가`
   - dev 서버가 재생성한 `apps/blog/app/tag-data.json` 이 있으면 함께 커밋
