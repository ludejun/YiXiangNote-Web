import './highlight';
import React, { Component } from 'react';
import Quill from 'quill';
import MagicUrl from 'quill-magic-url';
import QuillEmoji from 'quill-emoji';
import MarkdownShortcuts from './quill-markdown-shortcuts';
// import { ImageResize } from 'quill-image-resize-module';
// import { imageResize, quillImageHandler } from './imageProcess';
import { imageResize } from './imageProcess';
import Moment from '../../utils/moment';
import 'quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
// import 'highlight.js/styles/vs2015.css';
import './richTextEditor.less';

// 设置自定义字体/大小
const SizeStyle = Quill.import('attributors/style/size');
SizeStyle.whitelist = ['10px', '12px', '18px', '36px'];
Quill.register(SizeStyle, true);
const FontStyle = Quill.import('formats/font');
FontStyle.whitelist = ['wsYaHei', 'songTi', 'serif', 'arial'];
Quill.register(FontStyle, true);
// // 设置图片大小
// Quill.register('modules/imageResize', ImageResize);
// 输入URL自动识别超链接
Quill.register('modules/magicUrl', MagicUrl);
// Markdown识别
Quill.register('modules/markdownShortcuts', MarkdownShortcuts);
// 添加表情
Quill.register('modules/emoji-toolbar', QuillEmoji.ToolbarEmoji);
Quill.register('modules/emoji-shortname', QuillEmoji.ShortNameEmoji);
// 使<Shift>+<Enter>可行，不同于<Enter>，加shift后段落将仅仅换行而仍在前面一行样式中。常用于不中断有序列表的情况下，加入新行内容
// const Parchment = Quill.import('parchment');
const Delta = Quill.import('delta');
const Break = Quill.import('blots/break');
const Embed = Quill.import('blots/embed');
// const Block = Quill.import('blots/block');
function lineBreakMatcher() {
  const newDelta = new Delta();
  newDelta.insert({ break: '' });
  return newDelta;
}
Break.prototype.insertInto = function (parent, ref) {
  Embed.prototype.insertInto.call(this, parent, ref);
};
Break.prototype.length = function () {
  return 1;
};
Break.prototype.value = function () {
  return '\n';
};

export default class RichTextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // readOnly: false,
      autoSaveTime: null,
    };
  }

  componentDidMount() {
    // const toolbarOptions = [
    //   [{ bold: '粗体(Ctrl+B)' }, 'italic', 'underline', 'strike'], // toggled buttons
    //   ['blockquote', 'code-block'],
    //
    //   [{ header: 1 }, { header: 2 }], // custom button values
    //   [{ list: 'ordered' }, { list: 'bullet' }],
    //   [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    //   [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    //   [{ direction: 'rtl' }], // text direction
    //
    //   [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    //   [{ header: [1, 2, 3, 4, 5, 6, false] }],
    //
    //   [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    //   [{ font: [] }],
    //   [{ align: [] }],
    //
    //   ['clean'], // remove formatting button
    // ];

    this.quill = new Quill('#editor', {
      debug: process.env.NODE_ENV === 'development' ? 'info' : false,
      modules: {
        // formula: true, // todo 公式，暂不支持
        syntax: true,
        toolbar: {
          container: '#toolbar', // Selector for toolbar container
          handlers: {
            emoji() {},
            // image: quillImageHandler, // todo 处理图片先上传，再附链接。不处理默认保存base64
          },
        },
        // toolbar: toolbarOptions,
        // imageResize: {},
        magicUrl: true,
        markdownShortcuts: {},
        'emoji-toolbar': true,
        'emoji-shortname': true,
        clipboard: {
          matchers: [['BR', lineBreakMatcher]],
        },
        keyboard: {
          bindings: {
            // handleEnter: {
            //   key: 13,
            //   handler(range, context) {
            //     console.log(333333, range, context);
            //     if (range.length > 0) {
            //       // So we do not trigger text-change
            //       this.quill.scroll.deleteAt(range.index, range.length);
            //     }
            //     const lineFormats = Object.keys(context.format).reduce((lineFormat, format) => {
            //       if (
            //         Parchment.query(format, Parchment.Scope.BLOCK)
            //         && !Array.isArray(context.format[format])
            //       ) {
            //         lineFormat[format] = context.format[format];
            //       }
            //       return lineFormat;
            //     }, {});
            //     const previousChar = this.quill.getText(range.index - 1, 1);
            //     // Earlier scroll.deleteAt might have messed up our selection,
            //     // so insertText's built in selection preservation is not reliable
            //     this.quill.insertText(range.index, '\n', lineFormats, Quill.sources.USER);
            //     if (previousChar === '' || previousChar === '\n') {
            //       this.quill.setSelection(range.index + 2, Quill.sources.SILENT);
            //     } else {
            //       this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
            //     }
            //     this.quill.selection.scrollIntoView();
            //     Object.keys(context.format).forEach((name) => {
            //       if (lineFormats[name] != null) return;
            //       if (Array.isArray(context.format[name])) return;
            //       if (name === 'link') return;
            //       this.quill.format(name, context.format[name], Quill.sources.USER);
            //     });
            //   },
            // },
            linebreak: {
              key: 13,
              shiftKey: true,
              handler(range) {
                const nextChar = this.quill.getText(range.index + 1, 1);
                this.quill.insertEmbed(range.index, 'break', true, 'user');
                if (nextChar.length === 0) {
                  // second line break inserts only at the end of parent element
                  this.quill.insertEmbed(range.index, 'break', true, 'user');
                }
                this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
              },
            },
          },
        },

        history: {
          delay: 2000,
          maxStack: 100,
          userOnly: true,
        },
      },
      placeholder: '开始笔记（支持直接Markdown输入）...',
      readOnly: false,
      bounds: document.body,
      theme: 'snow',
    });

    // Toolbar tooltips
    // document
    //   .querySelectorAll('.ql-toolbar button')
    //   .forEach(dom => dom.addEventListener('mouseenter', () => (dom.title = dom.value)));
    // 图片resize
    document
      .querySelectorAll('.ql-editor img')
      .forEach(dom => dom.addEventListener('click', imageResize(dom)));

    // AutoSave
    let change = new Delta();
    this.quill.on('text-change', (delta) => {
      console.log(444444, delta);
      change = change.compose(delta);
    });
    this.saveTimer = setInterval(() => {
      if (change.length() > 0) {
        console.log('自动化保存中...', change);
        // todo API请求回调
        this.setState({ autoSaveTime: new Moment().format('YYYY-MM-DD hh:mm:ss') });
        change = new Delta();
      }
    }, 120000); // 2分钟自动保存一次
  }

  componentWillUnmount() {
    clearInterval(this.saveTimer);
  }

  saveContent() {
    console.log('保存中...', this.quill.getContents());
    // todo API请求
    document.getElementById('quillContent').innerHTML = JSON.stringify(this.quill.getContents());
  }

  render() {
    return (
      <div className="content-container">
        <div id="toolbar">
          <span className="ql-formats">
            <select className="ql-font" defaultValue="wsYaHei">
              <option value="wsYaHei">微软雅黑</option>
              <option value="songTi">宋体</option>
              <option value="serif">serif</option>
              <option value="arial">arial</option>
            </select>
            <select className="ql-size" defaultValue="14px">
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="18px">18px</option>
              <option value="36px">36px</option>
            </select>
          </span>
          <span className="ql-formats">
            <select className="ql-color" title="字体颜色" />
            <select className="ql-background" title="背景颜色" />
          </span>
          <span className="ql-formats">
            <button className="ql-bold" title="粗体(Ctr+B)" />
            <button className="ql-italic" title="斜体(Ctr+I)" />
            <button className="ql-underline" title="下划线(Ctr+U)" />
            <button className="ql-strike" title="中划线(Ctr+B)" />
          </span>
          <span className="ql-formats">
            <button className="ql-list" value="ordered" title="有序列表" />
            <button className="ql-list" value="bullet" title="无序列表" />
            <button className="ql-list" value="check" title="checklist" />
            <button className="ql-indent" value="-1" title="清除缩进" />
            <button className="ql-indent" value="+1" title="缩进" />
            {/* <button className="ql-direction" value="rtl"></button> */}
            <select className="ql-align" title="对齐方式" />
          </span>
          <span className="ql-formats">
            <button className="ql-blockquote" title="引用" />
            <button className="ql-code-block" title="代码块" />
            <button className="ql-link" title="超链接" />
            <button className="ql-image" title="图片" />
            <button className="ql-script" value="sub" title="右下标" />
            <button className="ql-script" value="super" title="右上标" />
            <button className="ql-emoji" />
            <button className="ql-clean" />
          </span>
        </div>
        <div id="editor" />
        <div>
          <p>{`上一次自动保存时间${this.state.autoSaveTime}`}</p>
        </div>
        <button onClick={() => this.saveContent()}>保存</button>
        <div id="quillContent" />
      </div>
    );
  }
}
