'use client'

import { ReadUserCompanyResponse } from '@/api/companies'
import { readUserCompany } from '@/api/companies/repository/hooks/readUserCompany'
import { useCartStore } from '@/app/(protected)/employee/newstate'
import { Loader } from '@/components'
import { useSafeReplace } from '@/hooks'
import { useReadIdentity } from '@/hooks/useIdentity'
import { useRoles } from '@/providers/RoleProvider/RoleProvider'
import { useCompanyStore } from '@/state'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

interface MainLayoutProps {
    children?: ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    const router = useRouter()
    const [userCompany, setUserCompany] = useState<ReadUserCompanyResponse>()
    const { data: identity, isFetched, isFetching: isFetchingIdentity } = useReadIdentity()
    const { roles } = useRoles()
    const [isFetchingCompany, setIsFetchingCompany] = useState(false)
    const setCompany = useCompanyStore(state => state.setCompany)
    const getCompany = useCompanyStore(state => state.getCompany)

    useEffect(() => {
        const handleBeforeUnload = (event: any) => {
          // This message is required to show the confirmation dialog
          const message = 'Da li ste sigurni da želite da napustite stranicu? Vaše izmene neće biti sačuvane.';
          event.returnValue = message;
          return message;
        };
    
        // Attach the event listener
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        // Clean up the event listener on component unmount
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, []);

    useEffect(() => {
        if (!isFetched) return

        if (!identity) return router.push('/login')

        if (identity && roles.Admin) {
            return router.push('/admin/companies')
        }

        if (identity && (roles.Employee || roles.CompanyManager)) {
            const company = getCompany()
            if (company.companyCode && company.companyId) {
                return router.push(`/employee/companies/${company.companyCode}`)
            } else {
                setIsFetchingCompany(true)
                readUserCompany().then(company => {
                    setIsFetchingCompany(false)
                    setCompany(company.companyCode, company.companyId)
                    setUserCompany(company)
                })
            }
        }
    }, [identity, isFetchingIdentity, userCompany])

    if (isFetchingCompany || isFetchingIdentity) return <Loader />

    return (
        <section className='w-full bg-primary'>
            <div className='flex h-full items-center justify-center'>{children}</div>
        </section>
    )
}
