import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// 1. Pixel-based size logic
const Size = Quill.import("attributors/style/size") as any;
Size.whitelist = ["12px", "14px", "16px", "18px", "20px", "24px", "32px"];
Quill.register(Size, true);

const ContentEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const modules = {
    toolbar: [
      [{ size: ["12px", "14px", "16px", "18px", "20px", "24px", "32px"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div
      className="
      w-full overflow-hidden rounded-lg border border-zinc-600 bg-(--bg-clr) transition-all focus-within:border-(--text-clr)
      
      [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-zinc-800 [&_.ql-toolbar]:bg-zinc-900/50 [&_.ql-toolbar]:p-3
      
      [&_.ql-stroke]:stroke-(--text-clr) 
      [&_.ql-stroke]:stroke-[2.5px] 
      [&_.ql-fill]:fill-(--text-clr) 
      
      [&_.ql-picker]:text-(--text-clr) 
      [&_.ql-picker-label]:text-(--text-clr)! 
      [&_.ql-picker-item]:text-(--bg-clr)! 
      
      [&_.ql-toolbar_button_svg]:pointer-events-none
      [&_.ql-toolbar_button]:flex [&_.ql-toolbar_button]:items-center [&_.ql-toolbar_button]:justify-center [&_.ql-toolbar_button]:p-1.5 [&_.ql-toolbar_button]:m-0.5
      
 
      
      [&_.ql-picker.ql-size]:w-24 [&_.ql-picker-label]:border-none
      [&_.ql-picker-label[data-value='12px']::before]:content-['12px']
      [&_.ql-picker-label[data-value='14px']::before]:content-['14px']
      [&_.ql-picker-label[data-value='16px']::before]:content-['16px']
      [&_.ql-picker-label[data-value='18px']::before]:content-['18px']
      [&_.ql-picker-label[data-value='20px']::before]:content-['20px']
      [&_.ql-picker-label[data-value='24px']::before]:content-['24px']
      [&_.ql-picker-label[data-value='32px']::before]:content-['32px']
      [&_.ql-picker-label:not([data-value])::before]:content-['16px']

      [&_.ql-picker-item[data-value='12px']::before]:content-['12px']
      [&_.ql-picker-item[data-value='14px']::before]:content-['14px']
      [&_.ql-picker-item[data-value='16px']::before]:content-['16px']
      [&_.ql-picker-item[data-value='18px']::before]:content-['18px']
      [&_.ql-picker-item[data-value='20px']::before]:content-['20px']
      [&_.ql-picker-item[data-value='24px']::before]:content-['24px']
      [&_.ql-picker-item[data-value='32px']::before]:content-['32px']
      
      [&_.ql-picker-options]:bg-zinc-900 [&_.ql-picker-options]:border-zinc-700 [&_.ql-picker-options]:shadow-2xl [&_.ql-picker-options]:rounded-md
      [&_.ql-picker-item]:py-2 [&_.ql-picker-item]:px-3
      [&_.ql-picker-item:hover]:text-(--bg-clr)! 
      [&_.ql-picker-item:hover]:bg-(--text-clr)
      
      [&_.ql-container]:border-none [&_.ql-editor]:min-h-40 [&_.ql-editor]:text-zinc-100 [&_.ql-editor]:text-lg
    "
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder="Write your post content..."
      />
    </div>
  );
};

export default ContentEditor;
