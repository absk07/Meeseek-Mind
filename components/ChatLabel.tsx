import React, { JSX, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";

interface OpenMenuType {
  id: string;
  open: boolean;
}

interface ChatLabelProps {
  openMenu: OpenMenuType;
  setOpenMenu: React.Dispatch<React.SetStateAction<OpenMenuType>>;
  id: string;
  name: string;
}

const ChatLabel = ({ openMenu, setOpenMenu, id, name }: ChatLabelProps): JSX.Element => {
  const { getChats, chats, setSelectedChat } = useAppContext();

  const menuRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [showConfirm, setShowConfirm] = useState(false);

  const selectChat = () => {
    if (!isEditing) {
      const chatData = chats?.find((c) => c._id === id);
      if (chatData) setSelectedChat(chatData);
    }
  };

  const handleRename = async () => {
    if (!editName || editName === name) return setIsEditing(false);
    try {
      const { data } = await axios.post("/api/chat/rename", {
        chatId: id,
        name: editName,
      });
      if (data.success) {
        await getChats();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
        console.error(err);
      } else {
        toast.error("An unknown error occurred.");
        console.error("Unknown error:", err);
      }
    } finally {
      setIsEditing(false);
      setOpenMenu({ id: "0", open: false });
    }
  };

  const deleteChat = async () => {
    try {
      const { data } = await axios.post("/api/chat/delete", { chatId: id });
      if (data.success) {
        await getChats();
        setOpenMenu({ id: "0", open: false });
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
          console.error(err);
      } else {
        toast.error("An unknown error occurred.");
        console.error("Unknown error:", err);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openMenu.id === id &&
        openMenu.open &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenu({ id: "0", open: false });
        setIsEditing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu, id]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing, setOpenMenu]);

  return (
    <div
      onClick={selectChat}
      className="flex items-center justify-between p-2 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer"
    >
      <div className="truncate max-w-[80%] group-hover:text-white">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
              if (e.key === "Escape") {
                setIsEditing(false);
                setEditName(name);
              }
            }}
            className="bg-transparent border border-white/30 rounded px-4 py-2 w-full text-white outline-none w-full"
          />
        ) : (
          <p>{name}</p>
        )}
      </div>

      <div
        ref={menuRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenu((prev) => ({ id, open: prev.id !== id || !prev.open }));
        }}
        className="group relative flex items-center justify-center h-6 w-6 aspect-square hover:bg-black/80 rounded-lg"
      >
        <Image
          className={`w-4 ${openMenu.id === id && openMenu.open ? "" : "hidden"
            } group-hover:block`}
          src={assets.three_dots}
          alt=""
        />
        <div
          className={`${openMenu.id === id && openMenu.open ? "block" : "hidden"
            } absolute -right-26 top-6 bg-gray-700 rounded-xl w-max p-2`}
        >
          <div
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg"
          >
            <Image className="w-4" src={assets.pencil_icon} alt="" />
            <p>Rename</p>
          </div>
          <div
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg"
          >
            <Image className="w-4" src={assets.delete_icon} alt="" />
            <p>Delete</p>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          deleteChat();
        }}
        message="Are you sure you want to delete this chat?"
      />
    </div>
  );
};

export default ChatLabel;
