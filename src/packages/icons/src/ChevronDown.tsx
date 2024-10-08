import { SVGProps } from 'react'

export const ChevronDown = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        strokeWidth='1.5'
        stroke='currentColor'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        {...props}>
        <path stroke='none' d='M0 0h24v24H0z' fill='none' />
        <polyline points='6 9 12 15 18 9' />
    </svg>
)
