import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import * as fileSaver from 'file-saver';
import * as json2md from 'json2md';
import pdfMake from 'pdfmake/build/pdfmake';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import icClose from '@iconify/icons-ic/twotone-close';
import icDownload from '@iconify/icons-ic/baseline-download';

@Component({
  selector: 'vex-markdown-dialog',
  templateUrl: './markdown-dialog.component.html',
  styleUrls: ['./markdown-dialog.component.scss']
})
export class MarkdownDialogComponent {

  icClose = icClose;
  icDownload = icDownload;

  text: string;
  title: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<MarkdownDialogComponent>) {
    if (this.data) {
      this.title = this.data[0].h1;
      this.text = json2md(this.data);
    }
  }

  mdDownload(): void {
    const blob = new Blob([this.text], { type: 'text/plain;charset=utf-8' });
    fileSaver.saveAs(blob, `${this.title}.md`);
  }

  pdfDownload(): void {
    const docx = document.getElementById('mdpdf');
    const html = htmlToPdfmake(docx.innerHTML, { tableAutoSize: true });
    const documentDefinition = {
      content: html,
      styles: {
        'html-pre': {
          background: '#ebebee',
        }
      }
    };
    pdfMake.createPdf(documentDefinition).download(`${this.title}.pdf`);
  }
}
