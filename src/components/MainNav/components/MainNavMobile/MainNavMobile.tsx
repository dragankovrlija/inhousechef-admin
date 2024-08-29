'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetFooter, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { useLogout } from '@/hooks'
import clsx from 'clsx'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { ChevronRight } from '@/packages/icons'
import { useReadDailyMenus } from '@/api/daily-menus'
import { calculateDateRange } from '@/app/(protected)/employee/companies/[companyCode]/utils'
import { MenuPage } from './components/MenuPage/MenuPage'
import { MyOrdersPage } from './components/MyOrdersPage/MyOrdersPage'
import { CartIcon, LogoutIcon, MenuIcon, TermsAndConditionsIcon, UserGroupIcon, UserProfileIcon } from './icons'
import { MainNavLink } from '../../types'
import { UsersPage } from './components/UsersPage/UsersPage'
import { TermsAndConditionsPage } from './components/TermsAndConditionsPage/TermsAndConditionsPage'
import { useReadMyOrders } from '@/api/order/repository/hooks/readMyOrder'
import { RequireCompanyAuthorization } from '@/components/RequireAuthorization/RequireAuthorization'
import { useRoles } from '@/providers/RoleProvider/RoleProvider'

interface MainNavMobileProps {
    isNavOpen: boolean
    onOverlayClick: VoidFunction
}

export const MEAL_RELATED_LINKS: MainNavLink[] = [
    {
        label: 'Moje porudžbine',
        path: 'my-orders',
        icon: <CartIcon />
    },
    {
        label: '7-dnevni jelovnik',
        path: 'menu',
        icon: <MenuIcon />
    },
]

export const USER_RELATED_LINKS: MainNavLink[] = [
    {
        label: 'Moj profil',
        path: 'profile',
        icon: <UserProfileIcon />
    },
    {
        label: 'Upravljanje korisnicima',
        path: 'users',
        icon: <UserGroupIcon />
    }
]

export const TERMS_AND_CONDITIONS = [
    {
        label: 'Uslovi korišćenja',
        path: 'privacy-policy',
        icon: <TermsAndConditionsIcon />
    }
]


export interface CloseSectionProps {
    close: () => void;
    heading: string;
}

export const CloseSection = ({ close, heading }: CloseSectionProps) => {
    return (
        <SheetClose asChild>
            <button onClick={close} className="mb-4 text-right text-black">
                <div className="flex flex-start gap-4">
                    <div className="flex items-center justify-center h-10 w-10 bg-gray-200 rounded-full">
                        <ChevronLeft className="h-5 w-5" />
                    </div>
                    <div className='flex items-center justify-center'>
                        <p className="text-xl font-semibold">{heading}</p>
                    </div>
                </div>
            </button>
        </SheetClose>
    )
}

export const MainNavMobile = ({ isNavOpen, onOverlayClick }: MainNavMobileProps) => {
    const logout = useLogout()
    const { roles } = useRoles()
    const { from: sevenDayMenuFrom, to: sevenDayMenuTo } = calculateDateRange(new Date().toISOString(), 7)
    const {from, to} = calculateDateRange(new Date().toISOString(), -7)
    const { data: dailyMenus } = useReadDailyMenus({
        path: '',
        query: {
            filter: { from: sevenDayMenuFrom, to: sevenDayMenuTo }
        }
    })
    const { data: activeOrders } = useReadMyOrders({
        query: { 
            filter: { 
                fromDate: to, 
                toDate: from, 
                orderStates: ["Draft", "Placed"].join(','), 
                orderTypes: ["Scheduled", "Immediate"].join(',') 
            }
        },
        options: {enabled: true}
    })

    const { data: orderHistory } = useReadMyOrders({
        query: { 
            filter: { 
                fromDate: from, 
                toDate: to, 
                orderStates: ["Confirmed", "Cancelled"].join(','), 
                orderTypes: ["Scheduled", "Immediate"].join(',') 
            }
        },
        options: {enabled: true}
    });

    // State to track which sub-drawer is open
    const [activeDrawer, setActiveDrawer] = useState<string | null>(null)
    const openDrawer = (drawerId: string) => {
         setActiveDrawer(drawerId)
    }
    const closeDrawer = () => {
        setActiveDrawer(null)
    }

    return (
        <Sheet open={isNavOpen} onOpenChange={onOverlayClick}>
            <SheetTrigger asChild>
                <div
                    onClick={onOverlayClick}
                    className={clsx(
                        'absolute inset-0 top-[var(--topnav-height)] z-30 bg-[#1B1C31]/50 backdrop-blur-[5px] backdrop-filter transition-opacity duration-300',
                        {
                            'pointer-events-none opacity-0': !isNavOpen,
                            'pointer-events-auto opacity-100': isNavOpen
                        }
                    )}
                ></div>
            </SheetTrigger>
            <SheetContent side="right" className="px-6 py-8 flex flex-col h-full">
                <div className="flex-grow">
                    <div className="flex flex-col">
                        <div className='flex justify-left mb-6'>
                            <CloseSection close={onOverlayClick} heading='Menu' />
                        </div>
                        <div className='flex flex-col flex-start gap-8'>
                            <ul>
                                {MEAL_RELATED_LINKS.map(({ path, label, icon }, index) => (
                                    <li
                                        className={clsx("flex items-center bg-gray-100 py-6 px-4 gap-4 border-b last:border-b-0 hover:bg-gray-200 cursor-pointer transition-all", { 'rounded-t-lg': index === 0, 'rounded-b-lg': index === MEAL_RELATED_LINKS.length - 1 })}
                                        onClick={() => openDrawer(path)}
                                        key={path}
                                    >
                                        <div className="flex items-center justify-center h-10 w-10 bg-gray-50 rounded-full">
                                            {icon}
                                        </div>
                                        <span className="text-lg font-medium text-gray-700">
                                            {label}
                                        </span>
                                        <ChevronRight className="ml-auto text-gray-400" />
                                    </li>
                                ))}
                            </ul>
                            <ul>
                                <li
                                    className={clsx("flex items-center bg-gray-100 py-6 px-4 gap-4 border-b last:border-b-0 hover:bg-gray-200 cursor-pointer transition-all rounded-t-lg", { '': roles.CompanyManager === true, 'rounded-b-lg': roles.CompanyManager === false })}
                                    onClick={() => openDrawer('profile')}
                                    key={'profile'}
                                >
                                    <div className="flex items-center justify-center h-10 w-10 bg-gray-50 rounded-full">
                                        {/* Replace with your icon component */}
                                        {<UserProfileIcon />}
                                    </div>
                                    <span className="text-lg font-medium text-gray-700">
                                        {'Moj profil'}
                                    </span>
                                    <ChevronRight className="ml-auto text-gray-400" />
                                </li>
                                <RequireCompanyAuthorization role="CompanyManager">
                                    <li
                                        className={clsx("flex items-center bg-gray-100 py-6 px-4 gap-4 border-b last:border-b-0 hover:bg-gray-200 cursor-pointer transition-all rounded-b-lg")}
                                        onClick={() => openDrawer('users')}
                                        key={'users'}
                                    >
                                        <div className="flex items-center justify-center h-10 w-10 bg-gray-50 rounded-full">
                                            {/* Replace with your icon component */}
                                            {<UserGroupIcon />}
                                        </div>
                                        <span className="text-lg font-medium text-gray-700">
                                            {'Upravljanje korisnicima'}
                                        </span>
                                        <ChevronRight className="ml-auto text-gray-400" />
                                    </li>
                                </RequireCompanyAuthorization>
                            </ul>
                            <ul>
                                {TERMS_AND_CONDITIONS.map(({ path, label, icon }, index) => (
                                    <li
                                        className={clsx("flex bg-gray-100 py-6 px-4 items-center gap-4 border-b last:border-b-0 hover:bg-gray-200 cursor-pointer transition-all", { 'rounded-t-lg': index === 0, 'rounded-b-lg': index === TERMS_AND_CONDITIONS.length - 1 })}
                                        onClick={() => openDrawer(path)}
                                        key={path}
                                    >
                                        <div className="flex items-center justify-center h-10 w-10 bg-gray-50 rounded-full">
                                            {/* Replace with your icon component */}
                                            {icon}
                                        </div>
                                        <span className="text-lg font-medium text-gray-700">
                                            {label}
                                        </span>
                                        <ChevronRight className="ml-auto text-gray-400" />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <SheetFooter className="mt-auto">
                <Button
                    onClick={logout}
                    className="flex items-center gap-4 py-10 px-4 bg-gray-100 w-full rounded-lg hover:bg-gray-200 transition-all cursor-pointer"
                >
                    <div className="flex items-center justify-center h-10 w-10 bg-gray-50 rounded-full">
                        {/* Replace with your logout icon component */}
                        <LogoutIcon />
                    </div>

                    <div className="text-lg font-medium text-center text-gray-700">
                        Odjavi se
                    </div>
                    <ChevronRight className="ml-auto text-gray-400" />
                </Button>

                </SheetFooter>
            </SheetContent>

            <Sheet open={activeDrawer === 'my-orders'} onOpenChange={closeDrawer}>
                <SheetContent side="right" className="px-6 py-8 flex flex-col h-full">
                    <CloseSection close={closeDrawer} heading='Moje porudžbine' />
                    <div className="flex-grow overflow-y-auto p-1">
                        <MyOrdersPage activeOrders={activeOrders ?? []} orderHistory={orderHistory ?? []} />
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={activeDrawer === 'menu'} onOpenChange={closeDrawer}>
                <SheetContent side="right" className="px-6 py-8 flex flex-col h-full">
                    <CloseSection close={closeDrawer} heading='7-dnevni jelovnik' />
                    <div className="flex-grow overflow-y-auto p-1">
                        <MenuPage dailyMenus={dailyMenus ?? []} days={7} />
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={activeDrawer === 'users'} onOpenChange={closeDrawer}>
                <SheetContent side="right" className="px-6 py-8 flex flex-col h-full">
                    <CloseSection close={closeDrawer} heading='Upravljanje korisnicima' />
                    <div className="flex-grow overflow-y-hidden p-1">
                        <UsersPage />
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={activeDrawer === 'privacy-policy'} onOpenChange={closeDrawer}>
                <SheetContent side="right" className="px-6 py-8 flex flex-col h-full">
                    <CloseSection close={closeDrawer} heading='Uslovi korišćenja' />
                    <div className="flex-grow overflow-y-auto p-1">
                        <TermsAndConditionsPage />
                    </div>
                </SheetContent>
        </Sheet>
    </Sheet>
    )
}
