import './style.css';
import axios from 'axios';
import * as PDFJS from 'pdfjs-dist';
const BASEURL = 'http://localhost:3000/';
PDFJS.GlobalWorkerOptions.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.js';

// txt
axios.get(BASEURL+'txt/text.txt').then( res=> {
  const nTet = document.querySelector('#txt');
  nTet.innerHTML = res.data;
});

// word
axios.get(BASEURL+'word/word.docx').then( res=> {
  const nIframe = document.querySelector('#word');
  nIframe.srcdoc = res.data;
});

// excel
axios.get(BASEURL+'excel/excel.xlsx').then( res=> {
  const nTet = document.querySelector('#excel');
  nTet.innerHTML = res.data.join('<br/>');
});

// pdf
let container = document.getElementById('pdf');
PDFJS.getDocument(BASEURL+'pdf/pdf.pdf').promise.then(function(pdf) {
  let numPages = pdf.numPages;
  for(let i = 1; i <= numPages; i++) {
    pdf.getPage(i).then(function(page) {
      let viewport = page.getViewport({scale: 1});
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const nDiv = document.createElement('div');
      nDiv.appendChild(canvas);
      container.appendChild(nDiv);

      let renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      page.render(renderContext);
    });
  }
}).catch(function(error) {
  console.error('Error loading PDF', error);
});

