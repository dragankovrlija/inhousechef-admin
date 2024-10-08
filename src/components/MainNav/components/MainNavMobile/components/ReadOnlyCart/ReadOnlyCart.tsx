import React from 'react';
import { ReadMyOrderResponse } from '@/api/order';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { X } from 'lucide-react'; // Icon for the close button
import { useCartStore } from '@/app/(protected)/newstate';
import { formatEuropeanDate, formatTimeWithoutSeconds } from '@/utils/date';
import { OrderDetails } from '@/app/(protected)/companies/[companyCode]/components/NewCompanyOrderForm/Cart/OrderDetails/OrderDetails';

interface ReadOnlyCartProps {
    order: ReadMyOrderResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

const ReadOnlyCart: React.FC<ReadOnlyCartProps> = ({ order, isOpen, onClose }) => {
    const { aLaCarteShift, regularShifts } = useCartStore();
    if (!order) return null;

    const mainCourses = order.orderItems
        .filter(item => item.type === 'MainCourse')
        .sort((a, b) => a.name.localeCompare(b.name)) || [];

    const sideDishes = order.orderItems
        .filter(item => item.type === 'SideDish')
        .sort((a, b) => a.name.localeCompare(b.name)) || [];

    const totalAmount = order.orderItems.reduce((total, item) => total + item.price * item.quantity, 0) || 0;

    let message = <></>;

    const serbianLocale = 'sr-RS';
    if (order?.type === 'Immediate') {
        if (order.state === 'Confirmed') {
            const details = <OrderDetails 
                number={order.number}
                orderDate={order.orderDate}
                orderCreatedAt={order.created}
                shiftStart={aLaCarteShift?.shiftStartAt}
                shiftEnd={aLaCarteShift?.shiftEndAt} 
                placedAt={order.placedAt}
                confirmedAt={order.confirmedAt} />
            message = (
                <>
                    {details}
                    <div className="p-4 bg-green-100 rounded-md text-center text-sm text-green-700">
                        Hvala Vam na porudžbini! <br/> Biće poslužena u naredna <strong>dva sata</strong>.
                    </div>
                </>
            );
        }
    } else if (order?.type === 'Scheduled') {
        //@ts-ignore
        const shift = regularShifts.find(shift => shift.id === order?.orderedForShiftId);
    
        if (shift) {
            const shiftStartTime = new Date(`${order.orderDate}T${shift.shiftStartAt}`);
            const shiftEndTime = new Date(`${order.orderDate}T${shift.shiftEndAt}`);
            const orderDeadlineTime = new Date(
                shiftStartTime.getTime() - shift.orderingDeadlineBeforeShiftStart * 60 * 60 * 1000
            );

            const details = <OrderDetails 
                number={order.number}
                orderDate={order.orderDate}
                orderCreatedAt={order.created}
                shiftStart={shift.shiftStartAt}
                shiftEnd={shift.shiftEndAt} 
                placedAt={order.placedAt}
                confirmedAt={order.confirmedAt} />
    
            if (order.state === 'Draft') {
                message = (
                    <>
                        {details}
                        <div className="p-4 bg-yellow-100 rounded-md text-center text-sm text-yellow-700">
                            <p>Ovu započetu porudžbinu možete izmeniti do</p>
                            <p><strong>{formatEuropeanDate(new Date(order.orderDate))}</strong> <strong>{formatTimeWithoutSeconds(orderDeadlineTime.toLocaleTimeString(serbianLocale))}</strong></p>
                            <p>Nakon tog vremena, porudžbina će biti automatski odbačena.</p>
                        </div>
                    </>
                );
            } else if (order.state === 'Placed') {
                message = (
                    <>
                        {details}
                        <div className="p-4 bg-blue-100 rounded-md text-center text-sm text-blue-700">
                            <p>Vaša porudžbina je poručena i može se izmeniti do</p>
                            <p><strong>{formatEuropeanDate(new Date(order.orderDate))}</strong> <strong>{formatTimeWithoutSeconds(orderDeadlineTime.toLocaleTimeString(serbianLocale))}</strong></p>
                            <p>Nakon toga, porudžbina će biti zaključana i poslužena u izabranom periodu.</p>
                        </div>
                    </>
                );
            } else if (order.state === 'Confirmed') {
                message = (
                    <>
                        {details}
                        <div className="p-4 bg-green-100 rounded-md text-center text-sm text-green-700">
                            <p>Hvala Vam na porudžbini!</p>
                            <p>Biće poslužena <strong>{formatEuropeanDate(new Date(order.orderDate))}</strong></p>
                            <p>od <strong>{formatTimeWithoutSeconds(shiftStartTime.toLocaleTimeString(serbianLocale))}</strong> do <strong>{formatTimeWithoutSeconds(shiftEndTime.toLocaleTimeString(serbianLocale))}</strong></p>
                        </div>
                    </>
                );
            } else {
                message = (
                    <>
                        {details}
                    </>
                );
            }
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="bottom" className="w-full h-full bg-white flex flex-col">
                <SheetHeader className="flex justify-between items-center p-4 border-b">
                    <SheetTitle className="text-lg font-bold text-gray-700">Vaša porudžbina</SheetTitle>
                    <SheetClose asChild>
                        <button
                            className="text-gray-500 hover:text-gray-700 transition"
                            onClick={onClose}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </SheetClose>
                </SheetHeader>

                <div className="flex-1 py-4 space-y-4 overflow-y-auto">
                    {message}

                    {/* Main Courses Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-700">Glavna jela</h3>
                        {mainCourses.length > 0 ? (
                            <div className="space-y-2">
                                {mainCourses.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm flex-shrink-0">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div>
                                                <div className="font-semibold text-sm">{item.name}</div>
                                                <div className="text-xs text-gray-500">{item.price} RSD</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-center font-mono">
                                            x{item.quantity.toString().padStart(2, '0')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Nema glavnih jela u vašoj porudžbini.</p>
                        )}
                    </div>

                    {/* Side Dishes Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-700">Prilozi</h3>
                        {sideDishes.length > 0 ? (
                            <div className="space-y-2">
                                {sideDishes.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm flex-shrink-0">
                                        <div className="flex items-center space-x-2">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div>
                                                <div className="font-semibold text-sm">{item.name}</div>
                                                <div className="text-xs text-gray-500">{item.price} RSD</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-center font-mono">
                                            x{item.quantity.toString().padStart(2, '0')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Nema priloga u vašoj porudžbini.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white border-t mt-4 pt-4">
                    <p className="text-center text-gray-700 font-semibold">
                        Ukupno: {totalAmount.toFixed(2)} RSD
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ReadOnlyCart;
