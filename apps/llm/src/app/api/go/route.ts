import { NextResponse } from 'next/server'
import { aiProviderFactory } from '@/lib/ai/factory'
import { AI_MODEL, PLAYER } from '@/constants/go'

export async function POST(request: Request) {
  try {
    const { 
      board, 
      model = AI_MODEL.GEMINI_2_0_FLASH, 
      player = PLAYER.WHITE
    } = await request.json()

    if (!board) {
      return NextResponse.json(
        {
          error: '보드 상태가 제공되지 않았습니다.',
          success: false,
        },
        { status: 400 }
      )
    }

    // 프로바이더 팩토리에서 해당 모델의 프로바이더 가져오기
    const provider = aiProviderFactory.getProvider(model)
    
    if (!provider) {
      return NextResponse.json(
        {
          error: `지원하지 않는 모델입니다: ${model}`,
          success: false,
        },
        { status: 400 }
      )
    }

    console.log(`AI 모델 ${model}로 ${player} 플레이어 수 생성 중...`)

    // AI 프로바이더를 통해 다음 수 생성
    const result = await provider.generateMove(board, player, model)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    // Position을 사용하지 않는 경우를 위해 변수 추출을 제거

    // 패스인 경우
    if (result.isPass) {
      console.log(`${player} 플레이어가 패스했습니다.`)
      return NextResponse.json(result, { status: 200 })
    }

    // 기권인 경우
    if (result.isResignation) {
      console.log(`${player} 플레이어가 기권했습니다.`)
      return NextResponse.json(result, { status: 200 })
    }

    console.log(`${player} 플레이어 AI 선택 위치:`, result.position)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('AI API 오류:', error)
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다.',
        success: false,
      },
      { status: 500 }
    )
  }
}
