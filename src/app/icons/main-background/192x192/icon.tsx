import { ImageResponse } from 'next/og'
import { getThemeConfiguration } from "@/utils/configuration.utils";
import Color from "color";

// Image metadata
export const size = {
  width: 192,
  height: 192,
}
export const contentType = 'image/png';

export const dynamic = 'force-dynamic';

// Image generation
export default async function Icon({
  params,
}: {
  params: Promise<{ size: string }>
}) {
  const theme = await getThemeConfiguration();
  const primaryColor = Color(theme.primaryColor.hex);

  const darkCircleColor = primaryColor.darken(0.5);
  const lineColor = primaryColor.mix(Color('#FFFFFF'), 0.7)

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: theme.backgroundColor.hex,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={`${size.width}px`} height={`${size.height}px`}
             viewBox="0 0 150 150">
          <path
            d="M-110.498 72.444a4.242 4.242 0 0 0-4.251 4.25v15.868h4V77.677c0-.683.55-1.234 1.234-1.234h29.532c.683 0 1.234.55 1.234 1.234v26.533c0 .683-.55 1.234-1.234 1.234h-16.281v4H-79a4.242 4.242 0 0 0 4.251-4.251V76.695A4.242 4.242 0 0 0-79 72.444zM-65.498 114.444a4.241 4.241 0 0 0-4.251 4.25v28.498a4.241 4.241 0 0 0 4.25 4.251H-34a4.242 4.242 0 0 0 4.252-4.25v-28.499a4.242 4.242 0 0 0-4.252-4.25zm.983 4h29.532c.683 0 1.234.55 1.234 1.233v26.533c0 .683-.55 1.234-1.234 1.234h-29.532c-.684 0-1.235-.55-1.235-1.234v-26.533c0-.683.55-1.234 1.235-1.234z"
            style={{fill: lineColor.hex()}} transform="matrix(.97474 0 0 .97474 160.238 -32.619)"/>
          <path
            d="m-133.784 83.229-3.192 3.137 17.556 17.866a7.733 7.733 0 0 0-1.361 4.38 7.733 7.733 0 0 0 6.032 7.524v31.057a4.241 4.241 0 0 0 4.25 4.25h35.75c-.023.03 0-4 0-4h-34.766c-.684 0-1.234-.55-1.234-1.233V115.98a7.733 7.733 0 0 0 2.038-.967l16.541 14.618a5.664 5.664 0 0 0-.184 1.417 5.664 5.664 0 0 0 5.664 5.664 5.664 5.664 0 0 0 5.664-5.664 5.664 5.664 0 0 0-5.664-5.663 5.664 5.664 0 0 0-2.729.704l-16.472-14.557a7.733 7.733 0 0 0 .577-2.921 7.733 7.733 0 0 0-.369-2.358l12.122-8.84a3.921 3.921 0 0 0 1.752.415 3.921 3.921 0 0 0 3.921-3.921 3.921 3.921 0 0 0-3.92-3.92 3.921 3.921 0 0 0-3.922 3.92 3.921 3.921 0 0 0 .05.619l-11.864 8.653a7.733 7.733 0 0 0-5.504-2.3 7.733 7.733 0 0 0-2.854.546zM-65.498 72.444a4.241 4.241 0 0 0-4.251 4.251v28.498a4.24 4.24 0 0 0 4.25 4.25h35.75v-3.998l-10.028-.002h-24.738c-.684 0-1.234-.55-1.234-1.233V77.678c0-.684.55-1.234 1.234-1.234h29.532c.683 0 1.234.55 1.234 1.234v15.424h4V76.695a4.242 4.242 0 0 0-4.252-4.25z"
            style={{fill: lineColor.hex()}} transform="matrix(.97474 0 0 .97474 160.238 -32.619)"/>
          <path
            d="M-31.787 91.038a8.25 8.25 0 0 0-8.25 8.25 8.25 8.25 0 0 0 8.25 8.25 8.25 8.25 0 0 0 8.25-8.25 8.25 8.25 0 0 0-8.25-8.25zm0 4.25a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z"
            style={{fill: darkCircleColor.hex()}} transform="matrix(.97474 0 0 .97474 160.238 -32.619)"/>
          <path
            d="M-140.356 69.37a11 11 0 0 0-11 11.001 11 11 0 0 0 11 11 11 11 0 0 0 11-11 11 11 0 0 0-11-11zm0 5.667a5.333 5.333 0 0 1 5.333 5.334 5.333 5.333 0 0 1-5.333 5.333 5.333 5.333 0 0 1-5.334-5.333 5.333 5.333 0 0 1 5.334-5.334z"
            style={{fill: primaryColor.hex()}} transform="matrix(.97474 0 0 .97474 160.238 -32.619)"/>
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  )
}
