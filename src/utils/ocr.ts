import { pipeline, env } from '@huggingface/transformers';
import Tesseract from 'tesseract.js';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

interface OCRResult {
  text: string;
  confidence: number;
}

class OCRService {
  private static instance: OCRService;
  private ocrPipeline: any = null;
  private isInitializing = false;

  public static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  private async initializePipeline() {
    if (this.ocrPipeline || this.isInitializing) return;

    try {
      this.isInitializing = true;
      console.log('Initializing OCR pipeline...');

      this.ocrPipeline = await pipeline(
        'image-to-text',
        'Xenova/trocr-base-printed',
        { device: 'webgpu' }
      );

      console.log('OCR pipeline initialized (WebGPU)');
    } catch (error) {
      console.warn('WebGPU not available, falling back to CPU:', error);
      try {
        this.ocrPipeline = await pipeline(
          'image-to-text',
          'Xenova/trocr-base-printed'
        );
        console.log('OCR pipeline initialized (CPU)');
      } catch (cpuError) {
        console.error('Failed to initialize OCR pipeline:', cpuError);
        throw new Error('Failed to initialize OCR service');
      }
    } finally {
      this.isInitializing = false;
    }
  }

  private async loadImage(input: File | Blob | string | HTMLImageElement): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      if (input instanceof File || input instanceof Blob) {
        img.src = URL.createObjectURL(input);
      } else if (typeof input === "string") {
        img.src = input; // URL or base64
      } else {
        return resolve(input); // already HTMLImageElement
      }

      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }

  private async preprocessImage(imageElement: HTMLImageElement): Promise<ImageData> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const maxSize = 1024;
    let { width, height } = imageElement;
    if (width > maxSize || height > maxSize) {
      const aspectRatio = width / height;
      if (width > height) {
        width = maxSize;
        height = maxSize / aspectRatio;
      } else {
        height = maxSize;
        width = maxSize * aspectRatio;
      }
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(imageElement, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.round(
        0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      );
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
    ctx.putImageData(imageData, 0, 0);

    return ctx.getImageData(0, 0, width, height);
  }

  public async extractText(input: File | Blob | string | HTMLImageElement): Promise<OCRResult> {
    try {
      await this.initializePipeline();
      if (!this.ocrPipeline) throw new Error('OCR pipeline not available');

      const imageElement = await this.loadImage(input);
      const processedImage = await this.preprocessImage(imageElement);

      const result = await this.ocrPipeline(processedImage);
      console.log('OCR result:', result);

      return {
        text: result[0]?.generated_text || '',
        confidence: 0.9,
      };
    } catch (error) {
      console.error('OCR failed, switching to Tesseract.js:', error);
      return this.fallbackWithTesseract(input);
    }
  }

  private async fallbackWithTesseract(input: File | Blob | string | HTMLImageElement): Promise<OCRResult> {
    try {
      const imageElement = await this.loadImage(input);

      const { data: { text, confidence } } = await Tesseract.recognize(imageElement, 'eng');
      console.log('Tesseract OCR result:', text);

      return {
        text: text.trim(),
        confidence: confidence / 100,
      };
    } catch (error) {
      console.error('Tesseract OCR also failed:', error);
      return { text: '', confidence: 0 };
    }
  }
}

export const ocrService = OCRService.getInstance();
