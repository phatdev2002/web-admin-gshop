/**
 * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
 * https://ckeditor.com/ckeditor-5/builder/?redirect=portal#installation/NoFgNARATAdAzPCkCMIAMcBsBONGCsIcyAHPgOxzkk6ZpT4kgjXKH6ZwnJQlIQBTAHZI0YYMjBixkmQF1ImAMb5kyACb4IcoA===
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';

import '@/components/ui/editor.css';

const LICENSE_KEY =
	'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDQzMjk1OTksImp0aSI6IjM0ODVjYTZkLTZlZDktNGI1NC04ODY4LTY4YzkwMTc4YzVmMyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjdmZjJmZDA5In0.NvshURZVqqJo9bb2Tr38vv0az7iqdg5hmqWwKNJuZ57yhp9sVK5IgTqr9x_BtSCTtL6eiKSnW_WXRyVHTkU5hg';

const CLOUD_SERVICES_TOKEN_URL =
	'https://1wzqidjnqk07.cke-cs.com/token/dev/e342e95097671e0c7780ca31ce2a03ee22a6aa8d27f2f705cf46f8d6b9ae?limit=10';

  export default function Editor({
    value,
    onChange
  }: {
    value: string;
    onChange: (val: string) => void;
  }) {
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    const cloud = useCKEditorCloud({ version: '44.3.0', premium: true, ckbox: { version: '2.6.1' } });
  
    useEffect(() => {
      setIsLayoutReady(true);
      return () => setIsLayoutReady(false);
    }, []);
  
    const { ClassicEditor, editorConfig } = useMemo(() => {
      if (cloud.status !== 'success' || !isLayoutReady) return {};
  
      const {
        ClassicEditor,
        Autoformat, AutoImage, AutoLink, Autosave, Bold, CKBox, CKBoxImageEdit,
        CloudServices, Code, CodeBlock, Emoji, Essentials, GeneralHtmlSupport,
        Heading, HtmlComment, HtmlEmbed, ImageBlock, ImageCaption, ImageInline,
        ImageInsert, ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative,
        ImageToolbar, ImageUpload, Italic, Link, LinkImage, List, ListProperties,
        Mention, Paragraph, PasteFromOffice, PictureEditing, ShowBlocks, Table,
        TableCaption, TableCellProperties, TableColumnResize, TableProperties,
        TableToolbar, TextTransformation
      } = cloud.CKEditor;
  
      const { PasteFromOfficeEnhanced, SourceEditingEnhanced } = cloud.CKEditorPremiumFeatures;
  
      return {
        ClassicEditor,
        editorConfig: {
          toolbar: {
            items: [
              'sourceEditingEnhanced', 'showBlocks', '|', 'heading', '|', 'bold', 'italic',
              'code', '|', 'emoji', 'link', 'insertImage', 'ckbox', 'insertTable',
              'codeBlock', 'htmlEmbed', '|', 'bulletedList', 'numberedList'
            ],
            shouldNotGroupWhenFull: false
          },
          plugins: [
            Autoformat, AutoImage, AutoLink, Autosave, Bold, CKBox, CKBoxImageEdit, CloudServices,
            Code, CodeBlock, Emoji, Essentials, GeneralHtmlSupport, Heading, HtmlComment, HtmlEmbed,
            ImageBlock, ImageCaption, ImageInline, ImageInsert, ImageInsertViaUrl, ImageResize,
            ImageStyle, ImageTextAlternative, ImageToolbar, ImageUpload, Italic, Link, LinkImage,
            List, ListProperties, Mention, Paragraph, PasteFromOffice, PasteFromOfficeEnhanced,
            PictureEditing, ShowBlocks, SourceEditingEnhanced, Table, TableCaption, TableCellProperties,
            TableColumnResize, TableProperties, TableToolbar, TextTransformation
          ],
          cloudServices: {
            tokenUrl: CLOUD_SERVICES_TOKEN_URL
          },
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
              { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
              { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
              { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
            ]
          },
          htmlSupport: {
            allow: [{ name: /^.*$/, styles: true, attributes: true, classes: true }]
          },
          image: {
            toolbar: [
              'toggleImageCaption', 'imageTextAlternative', '|',
              'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText',
              '|', 'resizeImage', '|', 'ckboxImageEdit'
            ]
          },
          initialData: value || '', // ✅ load từ props
          licenseKey: LICENSE_KEY,
          link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
              toggleDownloadable: {
                mode: 'manual',
                label: 'Downloadable',
                attributes: {
                  download: 'file'
                }
              }
            }
          },
          list: {
            properties: {
              styles: true,
              startIndex: true,
              reversed: true
            }
          },
          mention: {
            feeds: [{ marker: '@', feed: [] }]
          },
          placeholder: 'Nhập nội dung bài viết...',
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
          }
        }
      };
    }, [cloud, isLayoutReady, value]);
  
    return (
      <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
        <div className="editor-container__editor">
          <div ref={editorRef}>
            {ClassicEditor && editorConfig && (
              <CKEditor
                editor={ClassicEditor}
                config={editorConfig}
                data={value}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  onChange(data); // ✅ gọi hàm setContent từ cha
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }