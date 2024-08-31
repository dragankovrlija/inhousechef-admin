import { DailyMenuMeal } from '@/api/daily-menus';
import { useCartStore } from '@/app/(protected)/employee/newstate';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useState } from 'react';
import MealDrawerCard from '../MealDrawerCard/MealDrawerCard';

interface CartSideDishDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CartSideDishDrawer = ({ isOpen, onClose }: CartSideDishDrawerProps) => {
    const { activeMenus, addOrUpdateOrder } = useCartStore();
    const [selectedMeal, setSelectedMeal] = useState<DailyMenuMeal | null>(null);
    const [quantity, setQuantity] = useState(1);

    const sideDishMeals = activeMenus?.flatMap(menu => menu.meals.filter(meal => meal.type === 'SideDish')) || [];

    const handleMealClick = (meal: DailyMenuMeal) => {
        setSelectedMeal(meal);
        setQuantity(1); // Reset quantity when a new meal is selected
    };

    const handleAddToOrder = () => {
        if (selectedMeal) {
            addOrUpdateOrder(selectedMeal.id, quantity);
            onClose();
        }
    };

    const handleQuantityChange = (increment: number) => {
        setQuantity(prevQuantity => Math.max(1, prevQuantity + increment));
    };

    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent>
                <div className='mx-auto w-full max-w-sm'>
                    <DrawerHeader className='text-left'>
                        <DrawerTitle className='mt-2 text-3xl font-bold lowercase'>Side Dishes</DrawerTitle>
                    </DrawerHeader>

                    <div className='px-2 py-4'>
                        <div className='flex space-x-4 overflow-x-auto pb-4'>
                            {sideDishMeals.map(meal => (
                                <MealDrawerCard 
                                    key={meal.id} 
                                    meal={meal} 
                                    onClick={() => handleMealClick(meal)} 
                                />
                            ))}
                        </div>
                    </div>

                    {selectedMeal && (
                        <DrawerFooter className="items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </Button>
                                <div className="text-lg font-semibold">{quantity}</div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => handleQuantityChange(1)}
                                >
                                    +
                                </Button>
                            </div>
                            <Button type="button" onClick={handleAddToOrder} className="flex items-center space-x-2">
                                <span>Dodaj u porudžbinu</span>
                                <span className="font-semibold">{(selectedMeal.price * quantity).toFixed(2)} RSD</span>
                            </Button>
                        </DrawerFooter>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
};
