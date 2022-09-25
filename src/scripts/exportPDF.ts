import jsPDF from "jspdf"; 
import html2canvas from "html2canvas";

async function exportPDF(title: string, element: HTMLElement){
    // 根据dpi放大，防止图片模糊
  const scale = window.devicePixelRatio > 1 ? window.devicePixelRatio : 2;
  // 下载尺寸 a4 纸 比例
  let pdf = new jsPDF('p', 'pt', 'a4');
  let width = element.offsetWidth;
  let height = element.offsetHeight;

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const contentWidth = canvas.width;
  const contentHeight = canvas.height;

  console.log('contentWidth', contentWidth, contentHeight)
  //一页pdf显示html页面生成的canvas高度;
  const pageHeight = contentWidth / 592.28 * 841.89;
  //未生成pdf的html页面高度
  let leftHeight = contentHeight;
  console.log('leftHeight', leftHeight)
  //页面偏移
  let position = 0;
  //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
  const imgWidth = 595.28;
  const imgHeight = 592.28 / contentWidth * contentHeight;
  const pdfCanvas = await html2canvas(element, {
    useCORS: true,
    canvas,
    scale,
    width,
    height,
    x: 0,
    y: 0,
  });
  const imgDataUrl = pdfCanvas.toDataURL();

  if (height > 14400) { // 超出jspdf高度限制时
    const ratio = 14400 / height;
    // height = 14400;
    width = width * ratio;
  }

  // 缩放为 a4 大小  pdf.internal.pageSize 获取当前pdf设定的宽高
  height = height * pdf.internal.pageSize.getWidth() / width;
  width = pdf.internal.pageSize.getWidth();
  if (leftHeight < pageHeight) {
    pdf.addImage(imgDataUrl, 'png', 0, 0, imgWidth, imgHeight);
  } else {    // 分页
    while (leftHeight > 0) {
      pdf.addImage(imgDataUrl, 'png', 0, position, imgWidth, imgHeight)
      leftHeight -= pageHeight;
      position -= 841.89;
      //避免添加空白页
      if (leftHeight > 0) {
        pdf.addPage();
      }
    }
  }
  // 导出下载 
  await pdf.save(`${title}.pdf`);
}

export default exportPDF;