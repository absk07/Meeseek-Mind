import React, { JSX } from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

interface OpenMenuType {
  id: string;
  open: boolean;
};

interface ChatLabelProps {
  openMenu: OpenMenuType;
  setOpenMenu: React.Dispatch<React.SetStateAction<OpenMenuType>>;
  id: string;
  name: string;
};

const ChatLabel = ({ openMenu, setOpenMenu, id, name }: ChatLabelProps): JSX.Element => {
    const { getChats, chats, setSelectedChat } = useAppContext();

    const selectChat = () => {
        const chatData = chats?.find(c => c._id === id);
        if(chatData) {
            setSelectedChat(chatData);
        }
    }

    const renameChat = async () => {
        try {
            const newName = prompt('Enter new name');
            if(!newName) return
            const { data } = await axios.post('/api/chat/rename', {
                chatId: id,
                name: newName
            });
            if(data.success) {
                await getChats();
                setOpenMenu({ id: '0', open: false });
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
                console.error(err);
            } else {
                toast.error('An unknown error occurred.');
                console.error('Unknown error:', err);
            }
        }
    }

    const deleteChat = async () => {
        try {
            const confirm = window.confirm('Are you sure?');
            if(!confirm) return;
            const { data } = await axios.post('/api/chat/delete', {
                chatId: id
            });
            if(data.success) {
                await getChats();setOpenMenu({ id: '0', open: false });
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
                console.error(err);
            } else {
                toast.error('An unknown error occurred.');
                console.error('Unknown error:', err);
            }
        }
    }

    return (
        <div onClick={selectChat} className='flex items-center justify-between p-2 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer'>
            <p className='truncate max-w-[80%] group-hover:text-white'>{name}</p>
            <div 
                onClick={e => { e.stopPropagation(); setOpenMenu(prev => ({ id: id, open: prev.id !== id || !prev.open })) }} 
                className='group relative flex items-center justify-center h-6 w-6 aspect-square hover:bg-b1ack/80 rounded-lg'
            >
                <Image className={`w-4 ${openMenu.id === id && openMenu.open ? '' : 'hidden'} group-hover:block`} src={assets.three_dots} alt='' />
                <div className={`${openMenu.id === id && openMenu.open ? 'block' : 'hidden'} absolute -right-26 top-6 bg-gray-700 rounded-xl w-max p-2`}>
                    <div onClick={renameChat} className='flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg'>
                        <Image className='w-4' src={assets.pencil_icon} alt='' />
                        <p>Rename</p>
                    </div>
                     <div onClick={deleteChat} className='flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg'>
                        <Image className='w-4' src={assets.delete_icon} alt='' />
                        <p>Delete</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatLabel;