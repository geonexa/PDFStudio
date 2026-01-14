# Advanced PDF Compression Techniques

## Current Implementation

The current compression uses these techniques:
1. **Object Streams**: Uses PDF object streams for better compression
2. **Remove Unused Objects**: Copies pages to new PDF, removing unused resources
3. **Metadata Removal**: Removes title, author, keywords, etc.
4. **Multi-pass Compression**: Applies compression multiple times (extreme mode)
5. **Structure Optimization**: Optimizes PDF internal structure

## Additional Techniques That Could Be Implemented

### 1. Image Compression (Most Effective)
**Challenge**: pdf-lib doesn't easily support extracting and re-embedding images
**Solutions**:
- Use `pdf.js` or `pdfjs-dist` to extract images, compress with canvas, then re-embed
- Use server-side tools like `ghostscript` or `qpdf`
- Use libraries like `pdf-image` or `pdf-poppler` (server-side)

**Implementation Example** (requires additional libraries):
```javascript
// Extract images, compress, re-embed
const images = await extractImagesFromPDF(pdfDoc)
const compressedImages = await Promise.all(
  images.map(img => compressImage(img, quality))
)
await embedCompressedImages(pdfDoc, compressedImages)
```

### 2. Image Downsampling
- Reduce image resolution (e.g., 300 DPI → 150 DPI)
- Resize large images to maximum dimensions
- Convert color images to grayscale if color isn't needed

### 3. Font Subsetting
- Only include used characters in fonts
- Remove unused font subsets
- Use standard fonts when possible

### 4. Content Stream Compression
- Use Flate compression for content streams
- Optimize graphics state operations
- Remove redundant operations

### 5. Annotation Flattening
- Flatten annotations into page content
- Remove interactive elements if not needed
- Convert form fields to static content

### 6. Advanced Algorithms
- **JBIG2**: For monochrome/scanned documents
- **CCITT Group 4**: For black-and-white images
- **JPEG2000**: Better compression than JPEG
- **LZMA**: Higher compression ratio (requires server-side)

## Recommended Server-Side Solutions

For maximum compression, consider:

1. **Ghostscript** (gs command):
```bash
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 \
   -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=output.pdf input.pdf
```

2. **qpdf**:
```bash
qpdf --linearize --object-streams=generate input.pdf output.pdf
```

3. **pdftk** with compression:
```bash
pdftk input.pdf output output.pdf compress
```

## Browser Limitations

Current browser-based compression is limited because:
- Cannot easily extract/compress images from PDFs
- Limited access to low-level PDF structures
- No access to advanced compression algorithms (JBIG2, CCITT, etc.)
- Memory constraints for large PDFs

## Best Practices

1. **For Text-Heavy PDFs**: Current techniques work well (10-30% reduction)
2. **For Image-Heavy PDFs**: 
   - Compress images before creating PDF
   - Use server-side tools for best results
   - Consider converting to lower DPI
3. **For Scanned Documents**: 
   - Use JBIG2 compression (server-side)
   - Convert to grayscale if color isn't needed
4. **For Mixed Content**: 
   - Use "Extreme" mode for maximum compression
   - Consider multi-pass compression

## Future Enhancements

1. **Image Compression Integration**: 
   - Add pdf.js for image extraction
   - Implement canvas-based image compression
   - Re-embed compressed images

2. **Server-Side API**:
   - Create API endpoint using Ghostscript/qpdf
   - Handle large files server-side
   - Better compression ratios

3. **Progressive Compression**:
   - Show compression progress
   - Allow cancellation
   - Preview before download

4. **Smart Compression**:
   - Analyze PDF content
   - Choose best strategy automatically
   - Optimize based on content type
