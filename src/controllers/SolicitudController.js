const SolicitudService = require('../services/SolicitudService');
const CommonHelper = require('../helpers/CommonHelper');

const pdf = require('pdf-parse');
let path = require("path");
const { PDFDocument } = require("pdf-lib")
const fs = require('fs');

class SolicitudController {
    static async listarSolicitudes(event) {
      try {
        console.log(path.resolve("prueba.pdf"));
        console.log('SolicitudController.listarSolicitudes');
        console.log(event.body);
        //const solicitudes = await SolicitudService.listarSolicitudes(event);
        const response = CommonHelper.buildResponse(event.body);
        let dataBuffer = await fs.readFileSync(__dirname + '/prueba.pdf');
        await pdf(dataBuffer).then(function(data) {
 
          // number of pages
          console.log(data.numpages);
          // number of rendered pages
          console.log(data.numrender);
          // PDF info
          console.log(data.info);
          // PDF metadata
          console.log(data.metadata); 
          // PDF.js version
          // check https://mozilla.github.io/pdf.js/getting_started/
          console.log(data.version);
          // PDF text
          //console.log(data.text); 
              
      });

      const cover = await PDFDocument.load(fs.readFileSync(__dirname + '/prueba.pdf'));
      //const content = await PDFDocument.load(fs.readFileSync(__dirname + '/sin_firma.pdf'));
    
      // Create a new document
      const doc = await PDFDocument.create();

      const [coverContent] = await doc.copyPages(cover, [4]);
      doc.addPage(coverContent);
      
      // Add the cover to the new doc
      const [coverPage] = await doc.copyPages(cover, [6]);
      doc.addPage(coverPage);
    
      

      // Add individual content pages
     /* const contentPages = await doc.copyPages(content, content.getPageIndices());
      for (const page of contentPages) {
        doc.addPage(page);
      }*/
    
      // Write the PDF to a file
      await fs.writeFileSync(__dirname + '/test.pdf', await doc.save());
      console.log('PDF FINAL');
      let dataBuffer2 = await fs.readFileSync(__dirname + '/test.pdf');
        await pdf(dataBuffer2).then(function(data) {
 
          // number of pages
          console.log(data.numpages);
          // number of rendered pages
          console.log(data.numrender);
          // PDF info
          console.log(data.info);
          // PDF metadata
          console.log(data.metadata); 
          // PDF.js version
          // check https://mozilla.github.io/pdf.js/getting_started/
          console.log(data.version);
          // PDF text
          //console.log(data.text); 
              
      });
       
        console.log(response)
        return response;
      } catch (error) {
        console.error(error);
        //return AwsUtils.buildErrorResponse(event, error);
      }
    }


    
  }
  
  module.exports = SolicitudController;