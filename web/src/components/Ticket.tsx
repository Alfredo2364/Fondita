import React from 'react';
import { Dish } from '@/types';
import { BRAND_SLOGANS, getRandomSlogan } from '@/constants/slogans';

interface TicketProps {
    items: { dish: Dish; quantity: number }[];
    total: number;
    tableNumber: string | number;
    date: Date;
    restaurantName?: string;
}

export const ClientTicket = React.forwardRef<HTMLDivElement, TicketProps>((props, ref) => {
    const slogan = getRandomSlogan();

    return (
        <div ref={ref} className="bg-white p-4 text-black font-mono text-sm w-[300px] mx-auto hidden print:block print:w-full print:mx-0">
            {/* Header */}
            <div className="text-center mb-4 border-b pb-2 border-black border-dashed">
                <h1 className="text-xl font-black uppercase tracking-wider mb-1">
                    {props.restaurantName || "FONDITA 3D"}
                </h1>
                <p className="text-xs italic mb-2">"{slogan}"</p>
                <div className="text-xs flex justify-between">
                    <span>{props.date.toLocaleDateString()}</span>
                    <span>{props.date.toLocaleTimeString()}</span>
                </div>
                <div className="text-xs font-bold mt-1 uppercase">
                    Mesa: {props.tableNumber}
                </div>
            </div>

            {/* Items */}
            <div className="mb-4">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-black text-xs">
                            <th className="pb-1" colSpan={2}>ITEM</th>
                            <th className="pb-1 text-right">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs">
                        {props.items.map((item, i) => (
                            <tr key={i}>
                                <td className="py-1 w-6 align-top">{item.quantity}x</td>
                                <td className="py-1 align-top">
                                    {item.dish.name}
                                    <div className="text-[10px] text-gray-500">
                                        @ ${item.dish.price.toFixed(2)}
                                    </div>
                                </td>
                                <td className="py-1 text-right align-top font-bold">
                                    ${(item.dish.price * item.quantity).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="border-t border-black border-dashed pt-2 mb-6">
                <div className="flex justify-between text-lg font-black">
                    <span>TOTAL</span>
                    <span>${props.total.toFixed(2)}</span>
                </div>
                <div className="text-xs text-center mt-1">
                    (IVA Incluido)
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs space-y-2">
                <p>¡Gracias por tu preferencia!</p>
                <p>Síguenos en redes sociales</p>
                <p className="font-bold border-t border-black pt-2">Wifi: FonditaGourmet / Pass: 12345</p>
            </div>
        </div>
    );
});

ClientTicket.displayName = 'ClientTicket';

export const KitchenTicket = React.forwardRef<HTMLDivElement, TicketProps>((props, ref) => {
    return (
        <div ref={ref} className="bg-white p-4 text-black font-sans w-[300px] mx-auto hidden print:block print:w-full print:mx-0">
            <div className="border-b-4 border-black pb-2 mb-4">
                <h2 className="text-2xl font-black text-center uppercase">COCINA</h2>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xl font-bold border-2 border-black px-2 py-1">
                        MESA {props.tableNumber}
                    </span>
                    <span className="text-sm font-bold">
                        {props.date.toLocaleTimeString()}
                    </span>
                </div>
            </div>

            <ul className="space-y-4">
                {props.items.map((item, i) => (
                    <li key={i} className="text-lg font-bold border-b border-gray-300 pb-2">
                        <span className="text-2xl mr-2">{item.quantity}</span>
                        <span>{item.dish.name}</span>
                        {/* Notes could go here if added to data model */}
                    </li>
                ))}
            </ul>
        </div>
    );
});

KitchenTicket.displayName = 'KitchenTicket';
