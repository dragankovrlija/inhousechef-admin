'use client'

import { useReadCompany, updateCompanyBrandingLogo } from "@/api/companies";
import { updateCompanyBrandingLogoSchema } from "@/app/(protected)/companies/schemas";
import { Header } from "@/components";
import { FileUploader } from "@/components/FileUploader";
import { FileUploaderContent, FileInput, FileUploaderItem, FileSvgDraw } from "@/components/FileUploader/FileUploader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Paperclip } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    AlertDialogFooter, 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';

interface CompanyUpdateFormProps {
    companyCode: string
}

type CompanyBrandingLogoUpdateFormData = z.infer<typeof updateCompanyBrandingLogoSchema>

export const CompanyBrandingLogoUpdateForm = ({ companyCode }: CompanyUpdateFormProps) => {
    const [files, setFiles] = useState<File[] | null>(null);
    const [imageURL, setImageURL] = useState<string | null | undefined>(null); // State to hold image URL
    const [previewImageURL, setPreviewImageURL] = useState<string | null>(null); // State for preview image
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal

    const { data: company, isLoading } = useReadCompany({ path: { companyCode } });

    const form = useForm<CompanyBrandingLogoUpdateFormData>({
        resolver: zodResolver(updateCompanyBrandingLogoSchema)
    });

    const { handleSubmit } = form;

    useEffect(() => {
        if (company) {
            setImageURL(company.branding?.logoUrl || '');
        }
    }, [company]);

    if (isLoading) {
        return <Loader />;
    }

    const handleFileChange = (newFiles: File[] | null) => {
        setFiles(newFiles);
        if (newFiles && newFiles.length > 0) {
            const file = newFiles[0];
            setPreviewImageURL(URL.createObjectURL(file)); // Set the preview image URL
        } else {
            setPreviewImageURL(null); // Clear the preview image URL
        }
    };

    const uploadImage = async () => {
        if (files && files.length > 0) {
            const formData = new FormData();
            formData.append('logo', files[0]);
            const updateResult = await updateCompanyBrandingLogo({ path: { companyCode }, body: formData });
            setImageURL(updateResult.branding?.logoUrl); // Update the main image URL
            setFiles(null); // Clear files after upload
            setPreviewImageURL(null); // Clear the preview after upload
            setIsModalOpen(false); // Close the modal
            return updateResult;
        }
        return null;
    };

    const onSubmit = async () => {
        await uploadImage();
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='h-full'>
                <Header heading='Logo' />
                <div className='mt-4'>
                    {imageURL ? (
                        <div className="mt-4">
                            <img src={imageURL} width={150} height={150} alt="Uploaded Image" className="rounded-lg" />
                        </div>
                    ) : (
                        <div className='mt-4 text-gray-500'>No image available</div>
                    )}
                </div>
                <div className='mt-8 flex items-center justify-between'>
                    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant='outline'>Replace Image</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className='p-6'>
                            <AlertDialogTitle>Upload New Image</AlertDialogTitle>
                            <AlertDialogDescription className='mb-4'>
                                Select an image to upload. Preview it before confirming the upload.
                            </AlertDialogDescription>

                            {previewImageURL && (
                                <div className='mt-4 w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center'>
                                    <img src={previewImageURL} alt='Preview image' className='object-cover w-full h-full rounded-lg' />
                                </div>
                            )}

                            <FormField
                                control={form.control}
                                name='logo'
                                render={({ field: { value, onChange, ...fieldProps } }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUploader
                                                {...fieldProps}
                                                value={files}
                                                onValueChange={handleFileChange}
                                                className="relative bg-background rounded-lg p-2"
                                            >
                                                <FileInput className="outline-dashed outline-1 outline-white">
                                                    <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full">
                                                        <FileSvgDraw />
                                                    </div>
                                                </FileInput>
                                                <FileUploaderContent>
                                                    {files &&
                                                        files.length > 0 &&
                                                        files.map((file, i) => (
                                                            <FileUploaderItem key={i} index={i}>
                                                                <Paperclip className="h-4 w-4 stroke-current" />
                                                                <span>{file.name}</span>
                                                            </FileUploaderItem>
                                                        ))}
                                                </FileUploaderContent>
                                            </FileUploader>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='mt-6 flex justify-end gap-4'>
                                <AlertDialogCancel asChild>
                                    <Button variant='secondary' onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button onClick={uploadImage}>Confirm Upload</Button>
                                </AlertDialogAction>
                            </div>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </form>
        </Form>
    )
}
