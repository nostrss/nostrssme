import { NextResponse } from 'next/server'
import { GoogleGenAI, Type } from '@google/genai'
import { prompt } from '@/constants/go/prompt'

export async function POST(request: Request) {
  try {
    const { board } = await request.json()

    const genai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY,
    })

    const response = await genai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: JSON.stringify(board) }],
        },
      ],
      config: {
        systemInstruction: prompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.NUMBER,
          },
          minItems: 2,
          maxItems: 2,
        },
      },
    })

    const responseText = response.text || ''
    let aiPosition

    try {
      // AI 응답을 JSON으로 파싱
      aiPosition = JSON.parse(responseText)

      // 응답이 배열인지 확인하고 길이가 2인지 확인
      if (!Array.isArray(aiPosition) || aiPosition.length !== 2) {
        throw new Error('AI response is not a valid position array')
      }

      const [row, col] = aiPosition

      // 패스인 경우
      if (row === -1 && col === -1) {
        return NextResponse.json(
          {
            position: [-1, -1],
            isPass: true,
            success: true,
          },
          { status: 200 }
        )
      }

      console.log('AI 선택 위치:', aiPosition)

      return NextResponse.json(
        {
          position: aiPosition,
          success: true,
        },
        { status: 200 }
      )
    } catch (error) {
      console.error('AI 응답 파싱 오류:', error)
      console.error('AI 원본 응답:', responseText)

      return NextResponse.json(
        {
          error: 'AI 응답을 파싱할 수 없습니다.',
          originalResponse: responseText,
          success: false,
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('API 오류:', error)
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다.',
        success: false,
      },
      { status: 500 }
    )
  }
}
