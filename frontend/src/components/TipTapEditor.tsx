"use client";

import React, { useState, useCallback } from "react";
import {
  EditorProvider,
  useCurrentEditor,
  EditorContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import ListItem from "@tiptap/extension-list-item";

import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiUnderline,
  RiFormatClear,
  RiFontColor,
} from "react-icons/ri";
import {
  MdOutlineUndo,
  MdOutlineRedo,
  MdHorizontalRule,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
} from "react-icons/md";
import { IoImagesSharp } from "react-icons/io5";

function getButtonClasses(isActive: boolean) {
  return `
    p-2 mx-1 rounded 
    hover:bg-gray-200
    ${isActive ? "bg-[var(--secondary-pink)] text-[var(--dark-color)]" : "text-gray-600"}
  `;
}

const MenuBar: React.FC = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  const addImage = useCallback(() => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = () => {
      const file = fileInput.files ? fileInput.files[0] : null;
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            editor.chain().focus().setImage({ src: reader.result.toString() }).run();
          }
        };
        reader.readAsDataURL(file);
      }
    };

    fileInput.click();
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="p-2 border-b border-gray-300 flex justify-center">
      <div className="flex flex-wrap justify-center items-center">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={getButtonClasses(editor.isActive("bold"))}
        >
          <RiBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={getButtonClasses(editor.isActive("italic"))}
        >
          <RiItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={getButtonClasses(editor.isActive("underline"))}
        >
          <RiUnderline />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={getButtonClasses(editor.isActive("strike"))}
        >
          <RiStrikethrough />
        </button>
        <button
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className="p-2 mx-1 rounded hover:bg-gray-200 text-gray-600"
        >
          <RiFormatClear />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={getButtonClasses(editor.isActive({ textAlign: "left" }))}
        >
          <MdFormatAlignLeft />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={getButtonClasses(editor.isActive({ textAlign: "center" }))}
        >
          <MdFormatAlignCenter />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={getButtonClasses(editor.isActive({ textAlign: "right" }))}
        >
          <MdFormatAlignRight />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={getButtonClasses(editor.isActive({ textAlign: "justify" }))}
        >
          <MdFormatAlignJustify />
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 mx-1 rounded hover:bg-gray-200 text-gray-600"
        >
          <MdHorizontalRule />
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 mx-1 rounded hover:bg-gray-200 text-gray-600"
        >
          <MdOutlineUndo />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 mx-1 rounded hover:bg-gray-200 text-gray-600"
        >
          <MdOutlineRedo />
        </button>
        <input
          id="colorPicker"
          type="color"
          onInput={(event) =>
            editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()
          }
          value={editor.getAttributes("textStyle").color || "#000000"}
          data-testid="colorPickerButton"
          className="absolute top-0 left-0 w-0 h-0 opacity-0"
        />
        <button
          onClick={() => document.getElementById("colorPicker")?.click()}
          className="p-2 mx-1 rounded hover:bg-gray-200 text-gray-600"
        >
          <RiFontColor style={{ color: editor.getAttributes("textStyle").color || "#000000" }} />
        </button>
        <button
          onClick={addImage}
          className="p-2 mx-1 rounded hover:bg-gray-200 text-gray-600"
        >
          <IoImagesSharp />
        </button>
      </div>
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  Underline,
  TextStyle,
  Image.configure({ inline: true }),
  Placeholder.configure({
    emptyEditorClass:
      "before:content-[attr(data-placeholder)] before:block before:text-gray-400 before:pointer-events-none",
    placeholder: "Content...",
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: true,
      HTMLAttributes: {
        class: "list-disc pl-4 my-5 mr-4 ml-1.5",
      },
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: true,
      HTMLAttributes: {
        class: "list-decimal pl-4 my-5 mr-4 ml-1.5",
      },
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Link.configure({
    openOnClick: true,
    autolink: true,
    linkOnPaste: true,
    defaultProtocol: "https",
    protocols: ["http", "https"],
  }),
];

interface TipTapEditorProps {
  content?: string;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ content = "" }) => {
  const [title, setTitle] = useState("");

  return (
    <div
      className="bg-white text-gray-800 border border-gray-300 shadow-md rounded-md flex flex-col"
      style={{ height: "300px" }}
    >
      <EditorProvider
        extensions={extensions}
        content={content}
        immediatelyRender={false} 
        slotBefore={
          <div className="flex-none">
            <div className="p-2">
              <label className="block text-gray-700 font-semibold mb-1">
                Title (Required)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
                className="w-full border border-gray-300 rounded p-2 mb-2 focus:outline-none"
              />
            </div>
            <MenuBar />
          </div>
        }
      >
      </EditorProvider>
    </div>
  );
};

export default TipTapEditor;
