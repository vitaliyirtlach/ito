import { ComponentProps } from 'react'

export const GradientCheckIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.50013 13.4768L4.02513 10.0018L2.8418 11.1768L7.50013 15.8352L17.5001 5.83516L16.3251 4.66016L7.50013 13.4768Z"
        fill="url(#paint0_linear_49_39252)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_49_39252"
          x1="-13.0109"
          y1="-3.17386"
          x2="21.7075"
          y2="6.57181"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#00E5FF" />
          <stop offset="0.5" stop-color="#9D00FF" />
          <stop offset="0.826923" stop-color="#FF06B7" />
        </linearGradient>
      </defs>
    </svg>
  )
}
