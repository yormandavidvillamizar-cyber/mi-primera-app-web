import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'hsl(145, 50%, 40%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" stroke="white" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Horse head shape */}
            <path d="M5 4C5 4 8 3 10 6C12 9 10 14 10 14L5 16L4 9L5 4Z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 8L7 6" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Cow head shape */}
            <path d="M19 4C19 4 16 3 14 6C12 9 14 14 14 14L19 16L20 9L19 4Z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 7C14.5 8 15.5 8.5 16 8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 7C17.5 8 18.5 8.5 19 8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
