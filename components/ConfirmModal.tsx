'use client';
import React from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';

interface ConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message?: string;
}

const ConfirmModal = ({ isOpen, onConfirm, onCancel, message }: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center'>
            <div className='relative bg-[#3a3a46] text-white p-6 rounded-xl w-[90%] max-w-sm shadow-xl'>
                {/* Close Button */}
                <button
                    onClick={onCancel}
                    className='absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer'
                >
                    <Image className='w-8 h-8 cursor-pointer' src={assets.cross_icon} alt='' />
                </button>

                {/* Heading */}
                <h2 className='text-lg font-semibold mb-2 py-2'>Delete Chat ?</h2>

                {/* Message */}
                <p className='text-sm mb-5'>{message}</p>

                {/* Actions */}
                <div className='flex justify-end gap-3'>
                <button
                    onClick={onCancel}
                    className='px-4 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 transition text-gray-700 cursor-pointer'
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className='px-4 py-1.5 rounded-md bg-red-500 hover:bg-red-600 transition text-white cursor-pointer'
                >
                    Delete
                </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;