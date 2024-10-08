import { SVGProps } from 'react'

export const UserProfileIcon = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40' fill='none' {...props}>
            <circle cx='20' cy='20' r='19.5' fill='white' stroke='white' />
            <path
                d='M26 27V25.3333C26 24.4493 25.6839 23.6014 25.1213 22.9763C24.5587 22.3512 23.7956 22 23 22H17C16.2044 22 15.4413 22.3512 14.8787 22.9763C14.3161 23.6014 14 24.4493 14 25.3333V27'
                stroke='currentColor'
                strokeWidth='1.6'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M20 19C21.6569 19 23 17.6569 23 16C23 14.3431 21.6569 13 20 13C18.3431 13 17 14.3431 17 16C17 17.6569 18.3431 19 20 19Z'
                stroke='currentColor'
                strokeWidth='1.6'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    )
}
