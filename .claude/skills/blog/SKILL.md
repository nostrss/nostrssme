---
name: blog
description: 유튜브 URL, 일반 링크(글·문서), 또는 주제를 받아 apps/blog/data/blog 에 한국어 기술 블로그 글(MDX)을 작성한다. 블로그 글 작성을 요청하면 사용. Trigger: /blog <url|주제>
---

# 소재 → 블로그 글

입력(유튜브 URL / 일반 링크 / 주제)에서 **소재**를 수집하고, 그 소재를 정리한 한국어 블로그 글을 작성한다.

## 1. 소재 수집

입력을 판별해 해당 분기 하나만 따른다.

| 입력 | 분기 |
| --- | --- |
| `youtube.com` · `youtu.be` URL | 유튜브 |
| 그 외 http(s) URL | 링크 |
| URL 이 아닌 텍스트 | 주제 |

### 유튜브

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

### 링크

페이지 본문 전체를 가져와 읽는다. 제목·저자(또는 사이트)·게시일을 함께 기록한다. 가져오지 못하면(인증, 페이월, 빈 본문) 사용자에게 본문을 붙여달라고 요청하고 멈춘다.

### 주제

1차 출처(공식 문서, 스펙/RFC, 원저자 글)를 검색해 읽고, 참고한 출처 URL 목록을 남긴다. 주제가 한 편으로 쓰기에 넓으면 다룰 범위를 한 줄로 정해 사용자에게 알리고 진행한다.

## 2. 글 작성

파일: `apps/blog/data/blog/YYMMDD-<slug>.mdx` (오늘 날짜, slug 는 영어 kebab-case)

**충실성** — 글의 모든 사실 주장은 소재에서 확인할 수 있어야 한다. 유튜브·링크 글은 원본에 있는 내용만 쓰고, 주제 글은 주장마다 출처 링크를 본문에 건다. 소재에 없는 보충 설명이 꼭 필요하면 원본 내용과 구분되게 표시한다.

frontmatter:

```yaml
---
title: '한국어 제목'
date: 'YYYY-MM-DDT10:00:00'   # 같은 날 글이 이미 있으면 시간을 한 시간씩 미룸
tags: ['typescript', 'til']    # 소문자 kebab-case
draft: true                    # 초안은 항상 true 로 시작
summary: '한국어 요약 — 문제와 해법을 2~3문장으로'
images:
  - '...'
---
```

분기별 차이:

| | 유튜브 | 링크 | 주제 |
| --- | --- | --- | --- |
| title | `'한국어 제목 (영상 원제)'` | `'한국어 제목 (원제)'` | `'한국어 제목'` |
| tags | 원작자/채널 이름 태그 필수 | 저자/사이트 이름 태그 필수 | 주제 태그만 |
| images | `https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg` | `apps/blog/public/static/images/` 에 맞는 이미지가 있으면 `/static/images/<파일>`, 없으면 `images` 생략 | 링크와 동일 |
| 본문 첫 줄 | `[![영상 제목](썸네일 URL)](영상 URL)` | images 가 있으면 `![alt](이미지)` | 링크와 동일 |
| 출처 인용문 | `> 출처: [영상 원제](영상 URL) — 원작자. 영상의 내용을 기록으로 남겨두기 위해 ai로 번역해서 블로그를 작성했다.` | `> 출처: [원제](URL) — 저자. 글의 내용을 기록으로 남겨두기 위해 ai로 번역·정리해서 블로그를 작성했다.` | 인용문 대신 글 끝에 `## 참고` 로 출처 링크 목록 |

본문은 모든 분기에서 `## 정리`(불릿 3~4개)로 끝난다 (주제 글은 그 뒤에 `## 참고`).

본문 구조는 템플릿을 채우는 게 아니라 **소재의 실제 전개를 따른다**. 소재를 읽고 유형을 판단한 뒤 그에 맞는 흐름으로:

| 소재 유형 | 본문 흐름 예시 |
| --- | --- |
| 문제→해결형 팁 | `## 문제 — ...` → `## 해결 — ...` → (부가 팁 섹션) |
| 개념 설명형 | 개념 정의 → 동작 원리 → 예시 |
| 비교/리뷰형 | 선택지 소개 → 판단 기준 → 결론 |
| 튜토리얼형 | 단계별 진행 (1단계, 2단계, ...) |

조건부 섹션 — **기술 패턴을 다루는 소재일 때만** "정리" 앞에 추가:

```markdown
## 언제 쓰면 좋을까    # "프론트엔드에서" 처럼 한정하지 말 것
### 프론트엔드        # 실무 예시 2~3개, 각각 짧은 코드
### 백엔드           # 실무 예시 2~3개, 각각 짧은 코드
```

뉴스·비교·리뷰 소재에는 넣지 않는다.

스타일: 기존 글(`apps/blog/data/blog/`)의 어조를 따른다 — 평어체(~다), 코드 중심, 조사 앞 영단어 뒤 띄어쓰기(`payload 가`).

## 3. 리뷰 → 발행

1. `draft: true` 상태로 작성하고 사용자 검토를 받는다
2. 사용자가 발행을 요청하면 `draft: false` 로 변경
3. `/git-commit` 컨벤션으로 커밋 — `feat(blog): <글 주제> 글 추가`
   - dev 서버가 재생성한 `apps/blog/app/tag-data.json` 이 있으면 함께 커밋
