import { ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
    children?: ReactNode
}

export const Portal = ({ children }: PortalProps) => createPortal(children, document.body)
