function download(contentType: string, base64Data: string, fileName: string) {
  const linkSource = `data:${contentType};base64,${base64Data}`;
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}

function open(contentType: string, base64Data: string) {
  const string = `data:${contentType};base64,${base64Data}`;
  const iframe = "<iframe width='100%' height='100%' style='border: 0; outline: 0;' src='" + string + "'></iframe>"
  const x = window.open();

  if (!x) {
    return;
  }

  x.document.open();
  x.document.write(iframe);
  x.document.body.style.margin = '0px';
  x.document.body.style.padding = '0px';
  x.document.body.style.outline = '0px';
  x.document.close();
}

export const base64Utils = {
  download,
  open,
};
