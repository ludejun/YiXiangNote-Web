export function imageResize(dom) {
  console.log('图片被选中，开始Resize', dom);
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
