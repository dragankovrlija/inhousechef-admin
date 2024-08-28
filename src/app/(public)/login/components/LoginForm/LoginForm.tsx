'use client'
import { useCreateLogin } from '@/api/logins'
import { Error, Loader } from '@/components'
import CardWrapper from '@/components/auth/card-wrapper'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useIdentity } from '@/hooks/useIdentity'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createClientCredentialsSchema } from './schemas'

export const LoginForm = () => {
    const { setIdentity } = useIdentity()
    const form = useForm<z.infer<typeof createClientCredentialsSchema>>({
        resolver: zodResolver(createClientCredentialsSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    })

    const { control, handleSubmit } = form

    const { mutate, isPending, isError, error } = useCreateLogin()

    const onSubmit = (formData: z.infer<typeof createClientCredentialsSchema>) => {
        mutate(
            {
                path: '',
                body: {
                    ...formData,
                    grantType: 'password_credentials'
                }
            },
            {
                onSuccess: data => {
                    setIdentity(data)
                }
            }
        )
    }

    if (isPending) return <Loader />

    return (
        <>
            <CardWrapper label='Prijavite se' title='Dobro došli'>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                        <FormField
                            control={control}
                            name='username'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Korisničko ime</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='John Smith' required autoComplete='username' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lozinka</FormLabel>
                                    <FormControl>
                                        <Input {...field} type='password' required autoComplete='password' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {isError ? <Error error={error} /> : undefined}
                        <Button type='submit' className='w-full' disabled={isPending}>
                            {!isPending ? 'Prijavite se' : 'Učitavanje...'}
                        </Button>
                    </form>
                </Form>
            </CardWrapper>
        </>
    )
}
