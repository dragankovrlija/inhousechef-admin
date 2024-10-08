import React, { useState, useRef, useEffect } from 'react';
import { useCartStore } from '@/app/(protected)/newstate';
import { getToLocalISOString } from '@/utils/date';
import { ChevronDownIcon } from 'lucide-react';
import clsx from 'clsx';

export const DaySelectorDropdown: React.FC = () => {
    const { activeDay, setActiveDay, hasALaCardPermission, setActiveShift } = useCartStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const todayDate = getToLocalISOString(new Date()).split('T')[0];
    const tomorrowDate = getToLocalISOString(new Date(Date.now() + 86400000)).split('T')[0];

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        const handleOutsideTouch = (event: TouchEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        // Add both mousedown and touchstart event listeners
        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideTouch);

        return () => {
            // Remove both mousedown and touchstart event listeners
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideTouch);
        };
    }, [dropdownRef]);

    const handleDayChange = (day: 'today' | 'tomorrow') => {
        const selectedDate = day === 'today' ? todayDate : tomorrowDate;
        setActiveDay(selectedDate);
        setActiveShift(undefined);
        setIsDropdownOpen(false);
    };

    if (!hasALaCardPermission) {
        if (activeDay !== tomorrowDate) {
            setActiveDay(tomorrowDate);
        }
        return (
            <div className='flex flex-col items-left justify-left text-gray-700 font-bold'>
                <div>
                    Naručivanje za
                </div>
                <div>
                    <span className='font-normal'>Sutra</span>
                </div>
            </div>
        );
    }

    return (
        <div className='relative' ref={dropdownRef}>
            <div
                className='flex flex-col items-left justify-left cursor-pointer text-gray-700 font-bold'
                onClick={() => setIsDropdownOpen(prev => !prev)}
            >
                <span className='mr-1'>Naručivanje za</span>
                <div className='flex flex-row items-left justify-left'>
                    <div className='font-normal'>
                        {activeDay === todayDate ? 'Danas' : 'Sutra'}
                    </div>
                    <ChevronDownIcon className='ml-2 text-gray-700' />
                </div>
            </div>
            {isDropdownOpen && (
                <div className='absolute mt-2 w-32 bg-white shadow-md rounded-lg z-10'>
                    <ul className='py-2'>
                        <li
                            className={clsx(
                                'px-4 py-2 cursor-pointer hover:bg-gray-100',
                                { 'bg-primary text-white': activeDay === todayDate }
                            )}
                            onClick={() => handleDayChange('today')}
                        >
                            Danas
                        </li>
                        <li
                            className={clsx(
                                'px-4 py-2 cursor-pointer hover:bg-gray-100',
                                { 'bg-primary text-white': activeDay === tomorrowDate }
                            )}
                            onClick={() => handleDayChange('tomorrow')}
                        >
                            Sutra
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};
