"use client";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FileLoader } from "@ckeditor/ckeditor5-upload";
import { Editor } from "@ckeditor/ckeditor5-core";

// ✅ Adapter để tải ảnh lên server
class MyUploadAdapter {
  private loader: FileLoader;

  constructor(loader: FileLoader) {
    this.loader = loader;
  }

  async upload() {
    try {
      const file = await this.loader.file;
      if (!file) throw new Error("Không tìm thấy file");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("https://gshopbackend.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result: { url: string } = await response.json();
      return { default: result.url }; // Server phải trả về { url: "link ảnh" }
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }

  abort() {
    console.log("Upload aborted");
  }
}

// ✅ Plugin tùy chỉnh cho CKEditor
function CustomUploadAdapterPlugin(editor: Editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: FileLoader) => {
    return new MyUploadAdapter(loader);
  };
}

// ✅ Interface props cho Editor
interface EditorProps {
  value: string;
  onChange: (data: string) => void;
}

// ✅ Component chính
export default function EditorComponent({ value, onChange }: EditorProps) {
  return (
    <div className="border rounded p-2 bg-white">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={(_, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        config={{
          extraPlugins: [CustomUploadAdapterPlugin], // Thêm plugin upload ảnh
          licenseKey: "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDIyNTU5OTksImp0aSI6IjQxNmI2NDVlLTZmZmYtNDRjOC1hZDYxLTRiYWE1MmQ2ZDc5MiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjkxYmFlOWM3In0.r5BBLf3SK1Q39mj0g70zpCIWerLT81dy7rmQcFBoxdr0s3AMmsFN6KWpSvyqg6ufh4wr9nFZKCFcJJ2q2ECznw" // Thay bằng license key của bạn
        }}
      />
    </div>
  );
}




//////////
// config={{
//   licenseKey: "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDIyNTU5OTksImp0aSI6IjQxNmI2NDVlLTZmZmYtNDRjOC1hZDYxLTRiYWE1MmQ2ZDc5MiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjkxYmFlOWM3In0.r5BBLf3SK1Q39mj0g70zpCIWerLT81dy7rmQcFBoxdr0s3AMmsFN6KWpSvyqg6ufh4wr9nFZKCFcJJ2q2ECznw", // Gắn license key vào đây
// }}