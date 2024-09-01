'use client'

import { RequireCompanyAuthorization } from '@/components'
import { NewCompanyOrderForm } from './components/NewCompanyOrderForm/NewCompanyOrderForm'

export default function CompanyPage({}: { params: { companyCode: string } }) {
    console.log('lalalalalala')
    return (
        <>
            <RequireCompanyAuthorization role='Employee'>
                <NewCompanyOrderForm />
            </RequireCompanyAuthorization>
            <RequireCompanyAuthorization role='CompanyManager'>
                <NewCompanyOrderForm />
            </RequireCompanyAuthorization>
        </>
    )
}
