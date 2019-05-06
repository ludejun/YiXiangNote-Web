// export function imageResize() {
//   console.log('图片被选中，开始Resize', this);
// }
export class imageResize {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options || {};

    // disable native image resizing on firefox
    document.execCommand('enableObjectResizing', false, 'false');

    // respond to clicks inside the editor
    this.quill.root.addEventListener('click', this.handleClick.bind(this), false);
    const rootStyle = this.quill.root.parentNode.style;
    rootStyle.position = rootStyle.position || 'relative';
  }

  handleClick(e) {
    if (e.target && e.target.tagName === 'IMG') {
      if (this.img === e.target) {
        // we are already focused on this image
        return;
      }
      if (this.img) {
        // we were just focused on another image
        this.hide();
      }
      // clicked on an image inside the editor
      this.show(e.target);
    } else if (this.img) {
      // clicked on a non image
      this.hide();
    }
  }

  show(img) {
    // keep track of this img element
    this.img = img;

    this.showOverlay();
  }

  showOverlay() {
    if (this.overlay) {
      this.hideOverlay();
    }

    this.quill.setSelection(null);

    // prevent spurious text selection
    this.setUserSelect('none');

    // listen for the image being deleted or moved
    document.addEventListener('keyup', this.checkImage, true);
    this.quill.root.addEventListener('input', this.checkImage, true);

    // Create and add the overlay
    this.overlay = document.createElement('div');
    Object.assign(
      this.overlay.style,
      { position: 'absolute', border: '1px dashed #444' },
      this.options.overlayStyles || {},
    );
    this.overlay.innerHTML = '<div class="resize-box resize-left-top"></div>'
      + '<div class="resize-box resize-right-bottom"></div>';

    this.quill.root.parentNode.appendChild(this.overlay);

    this.repositionElements();
  }

  repositionElements() {
    if (!this.overlay || !this.img) {
      return;
    }

    // position the overlay over the image
    const parent = this.quill.root.parentNode;
    const imgRect = this.img.getBoundingClientRect();
    const containerRect = parent.getBoundingClientRect();

    Object.assign(this.overlay.style, {
      left: `${imgRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
      top: `${imgRect.top - containerRect.top + parent.scrollTop}px`,
      width: `${imgRect.width}px`,
      height: `${imgRect.height}px`,
    });

    [...document.getElementsByClassName('resize-box')].forEach((dom) => {
      // 开始下压
      dom.addEventListener('mousedown', this.onResizeMousedown.bind(this));
    });
  }

  setUserSelect = (value) => {
    ['userSelect', 'mozUserSelect', 'webkitUserSelect', 'msUserSelect'].forEach((prop) => {
      // set on contenteditable element and <html>
      this.quill.root.style[prop] = value;
      document.documentElement.style[prop] = value;
    });
  };

  hideOverlay = () => {
    if (!this.overlay) {
      return;
    }

    // Remove the overlay
    this.quill.root.parentNode.removeChild(this.overlay);
    this.overlay = undefined;

    // stop listening for image deletion or movement
    document.removeEventListener('keyup', this.checkImage);
    this.quill.root.removeEventListener('input', this.checkImage);

    // reset user-select
    this.setUserSelect('');
  };

  hide = () => {
    this.hideOverlay();
    // this.removeModules();
    this.img = undefined;
  };

  onResizeMousedown(e) {
    this.dragBox = e.target;
    this.dragStartX = e.clientX;
    this.preDragWidth = this.img.width || this.img.naturalWidth;
    this.preDragHeight = this.img.height || this.img.naturalHeight;

    document.addEventListener('mousemove', this.onResizeDrag, false);
    document.addEventListener('mouseup', this.onResizeMouseup, false);
  }

  onResizeDrag = (e) => {
    if (!this.img) {
      // image not set yet
      return;
    }
    // update image size 默认等比例
    const deltaX = e.clientX - this.dragStartX;

    let width = Math.round(this.preDragWidth + deltaX);
    if (this.dragBox.className.indexOf('resize-left-top') > 0) {
      width = Math.round(this.preDragWidth - deltaX);
    }
    // const width = Math.round(this.preDragWidth + deltaX);
    const height = Math.round((width / this.preDragWidth) * this.preDragHeight);
    this.img.width = width;
    this.img.height = height;

    this.overlay.style.width = `${width}px`;
    this.overlay.style.height = `${height}px`;
  };

  onResizeMouseup = () => {
    // stop listening for movement and mouseup
    document.removeEventListener('mousemove', this.onResizeDrag);
    document.removeEventListener('mouseup', this.onResizeMouseup);
  };
}

// todo 后续希望加上，图片拖拽，图片保存处理

export function quillImageHandler() {
  let fileInput = this.container.querySelector('input.ql-image[type=file]');

  if (fileInput === null) {
    fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
    fileInput.classList.add('ql-image');
    fileInput.addEventListener('change', () => {
      const { files } = fileInput;
      // const range = this.quill.getSelection(true);

      if (!files || !files.length) {
        console.log('No files selected');
        return;
      }

      const formData = new FormData();
      formData.append('file', files[0]);

      this.quill.enable(false);

      // todo 请求图片保存API
      // axios
      //   .post('/api/image', formData)
      //   .then(response => {
      //     this.quill.enable(true);
      //     this.quill.editor.insertEmbed(range.index, 'image', response.data.url_path);
      //     this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
      //     fileInput.value = '';
      //   })
      //   .catch(error => {
      //     console.log('quill image upload failed');
      //     console.log(error);
      //     this.quill.enable(true);
      //   });
    });
    this.container.appendChild(fileInput);
  }
  fileInput.click();
}
