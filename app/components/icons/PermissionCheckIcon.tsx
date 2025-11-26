import { ComponentProps } from 'react'

export const PermissionCheckIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg
      width="600"
      height="700"
      viewBox="0 0 600 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clip-path="url(#clip0_49_37427)">
        <g filter="url(#filter0_d_49_37427)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M319 150C208.543 150 119 239.543 119 350C119 460.456 208.543 550 319 550C429.456 550 519 460.456 519 350C519 239.543 429.456 150 319 150ZM413.675 308.311C420.775 301.211 420.775 289.699 413.675 282.598C406.575 275.498 395.062 275.498 387.962 282.598L291.727 378.833L250.038 337.144C242.938 330.044 231.426 330.044 224.325 337.144C217.225 344.244 217.225 355.756 224.325 362.856L278.871 417.402C285.971 424.502 297.484 424.502 304.584 417.402L413.675 308.311Z"
            fill="white"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M319 150C208.543 150 119 239.543 119 350C119 460.456 208.543 550 319 550C429.456 550 519 460.456 519 350C519 239.543 429.456 150 319 150ZM413.675 308.311C420.775 301.211 420.775 289.699 413.675 282.598C406.575 275.498 395.062 275.498 387.962 282.598L291.727 378.833L250.038 337.144C242.938 330.044 231.426 330.044 224.325 337.144C217.225 344.244 217.225 355.756 224.325 362.856L278.871 417.402C285.971 424.502 297.484 424.502 304.584 417.402L413.675 308.311Z"
            fill="url(#paint0_linear_49_37427)"
            fill-opacity="0.25"
          />
          <path
            d="M319 151C428.904 151 518 240.095 518 350C518 459.904 428.904 549 319 549C209.095 549 120 459.904 120 350C120 240.095 209.095 151 319 151ZM414.382 281.891C406.891 274.4 394.745 274.4 387.255 281.891L291.727 377.418L250.745 336.437C243.254 328.946 231.109 328.946 223.618 336.437C216.244 343.81 216.129 355.695 223.272 363.209L223.618 363.563L278.164 418.109C285.655 425.599 297.801 425.6 305.291 418.109L414.382 309.019C421.872 301.527 421.872 289.382 414.382 281.891Z"
            stroke="white"
            stroke-width="2"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_49_37427"
          x="47"
          y="150"
          width="544"
          height="552"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="80" />
          <feGaussianBlur stdDeviation="36" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_49_37427"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_49_37427"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_49_37427"
          x1="319"
          y1="150"
          x2="319"
          y2="550"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.389423" stop-color="white" stop-opacity="0" />
          <stop offset="1" stop-color="#9E9E9E" />
        </linearGradient>
        <clipPath id="clip0_49_37427">
          <rect width="600" height="700" rx="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
